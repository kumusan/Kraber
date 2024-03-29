use wasm_bindgen::prelude::*;
use web_sys::{HtmlCanvasElement, WebGlProgram, WebGlRenderingContext, WebGlShader, WebGlUniformLocation};
use wasm_bindgen::JsCast;
use std::rc::{Rc};
use std::cell::{RefCell};

use std::panic;
use console_error_panic_hook;

#[wasm_bindgen]
pub fn run_shader(vert_value: &str, frag_value: &str) 
    -> Result<(), JsValue> {
    panic::set_hook(Box::new(console_error_panic_hook::hook));

    let canvas: HtmlCanvasElement = get_element_by_id("canvas");
    let context = canvas
        .get_context("webgl")?
        .unwrap()
        .dyn_into::<WebGlRenderingContext>()?;

    let vert_shader = compile_shader(
        &context,
        WebGlRenderingContext::VERTEX_SHADER,
        vert_value,
    )?;
    let frag_shader = compile_shader(
        &context,
        WebGlRenderingContext::FRAGMENT_SHADER,
        frag_value,
    )?;
    let program = link_program(&context, &vert_shader, &frag_shader)?;
    context.use_program(Some(&program));

    let uni_location: Vec<UniformCheck> = get_uniform(&context, &program);

    // ---------------
    // let mut uni_location: Vec<UniformCheck> = Vec::new();
    // if let Some(t) = context.get_uniform_location(&program, "time") {
    //     let u = UniformCheck { uniform: t, name: "time".to_string() };
    //     uni_location.push(u);
    // }
    // if let Some(r) = context.get_uniform_location(&program, "resolution") {
    //     let u = UniformCheck { uniform: r, name: "resolution".to_string() };
    //     uni_location.push(u);
    // }
    // ---------------

    let v_position = create_vbo(&context);
    let v_index = create_ibo(&context);
    let att_location = context.get_attrib_location(&program, "position");

    context.bind_buffer(WebGlRenderingContext::ARRAY_BUFFER, v_position.as_ref());
    context.enable_vertex_attrib_array(att_location as u32);
    context.vertex_attrib_pointer_with_i32(att_location as u32, 3, WebGlRenderingContext::FLOAT, false, 0, 0);
    context.bind_buffer(WebGlRenderingContext::ELEMENT_ARRAY_BUFFER, v_index.as_ref());

    context.clear_color(0.0, 0.0, 0.0, 1.0);

    let start_time = js_sys::Date::now();

    // {
    //     let f = Rc::new(RefCell::new(None));
    //     let g = f.clone();

    //     *g.borrow_mut() = Some(Closure::wrap(
    //         Box::new(move || {
    //             render(&context, &uni_location, start_time);
    //             set_timeout(f.borrow().as_ref().unwrap(), 100);
    //         }) as Box<dyn FnMut()>
    //     ));

    //     set_timeout(g.borrow().as_ref().unwrap(), 100);
    // }
    {
        let f = Rc::new(RefCell::new(None));
        let g = f.clone();
        let uniform_len = uni_location.len() as u32;

        *g.borrow_mut() = Some(Closure::wrap(Box::new(move || {
            render(&context, &uni_location, start_time, uniform_len);
            request_animation_frame(f.borrow().as_ref().unwrap());
        }) as Box<dyn FnMut()>));

        request_animation_frame(g.borrow().as_ref().unwrap());
    }

    Ok(())
}

pub fn render(
    context: &WebGlRenderingContext,
    location: &Vec<UniformCheck>,
    start_time: f64,
    location_len: u32,
) {
    let time = (js_sys::Date::now() - start_time) * 0.001;

    context.clear(WebGlRenderingContext::COLOR_BUFFER_BIT);

    if location_len == 1 {
        if location[0].name == "time" {
            context.uniform1f(Some(&location[0].uniform), time as f32);
        } else if location[0].name == "resolution" {
            context.uniform2fv_with_f32_array(Some(&location[0].uniform), &[1000.0, 1000.0]);
        }
    } else if location_len == 2 {
        context.uniform1f(Some(&location[0].uniform), time as f32);
        context.uniform2fv_with_f32_array(Some(&location[1].uniform), &[1000.0, 1000.0]);
    }

    context.draw_elements_with_i32(
        WebGlRenderingContext::TRIANGLES,
        6,
        WebGlRenderingContext::UNSIGNED_SHORT,
        0
    );
    context.flush();

}

pub struct UniformCheck {
    uniform: WebGlUniformLocation,
    name: String,
}

fn get_uniform(
    context: &WebGlRenderingContext, 
    program: &WebGlProgram,
) -> Vec<UniformCheck> {
    let mut locations: Vec<UniformCheck> = Vec::new();
    if let Some(t) = context.get_uniform_location(&program, "time") {
        let u = UniformCheck { uniform: t, name: "time".to_string() };
        locations.push(u);
    }
    if let Some(r) = context.get_uniform_location(&program, "resolution") {
        let u = UniformCheck { uniform: r, name: "resolution".to_string() };
        locations.push(u);
    }
    locations
}

fn window() -> web_sys::Window {
    web_sys::window().expect("no global `window` exists")
}

fn document() -> web_sys::Document {
    window()
        .document()
        .expect("should have a document on window")
}

fn get_element_by_id<T: JsCast>(id: &str) -> T {
    document()
        .get_element_by_id(id)
        .expect("not found")
        .dyn_into::<T>()
        .map_err(|_| ())
        .unwrap()
}

// fn set_timeout(f: &Closure<dyn FnMut()>, ms: i32) {
//     window()
//         .set_timeout_with_callback_and_timeout_and_arguments_0(f.as_ref().unchecked_ref(), ms)
//         .expect("should register `requestAnimationFrame` OK");
// }

fn request_animation_frame(f: &Closure<dyn FnMut()>) {
    window()
        .request_animation_frame(f.as_ref().unchecked_ref())
        .expect("should register `requestAnimationFrame` OK");
}

pub fn compile_shader(
    context: &WebGlRenderingContext,
    shader_type: u32,
    source: &str,
) -> Result<WebGlShader, String> {
    let shader = context
        .create_shader(shader_type)
        .ok_or_else(|| String::from("Unable to create shader object"))?;
    context.shader_source(&shader, source);
    context.compile_shader(&shader);

    if context
        .get_shader_parameter(&shader, WebGlRenderingContext::COMPILE_STATUS)
        .as_bool()
        .unwrap_or(false)
    {
        Ok(shader)
    } else {
        Err(context
            .get_shader_info_log(&shader)
            .unwrap_or_else(|| String::from("Unknown error creating shader")))
    }
}

pub fn link_program(
    context: &WebGlRenderingContext,
    vert_shader: &WebGlShader,
    frag_shader: &WebGlShader,
) -> Result<WebGlProgram, String> {
    let program = context
        .create_program()
        .ok_or_else(|| String::from("Unable to create shader object"))?;

    context.attach_shader(&program, vert_shader);
    context.attach_shader(&program, frag_shader);
    context.link_program(&program);

    if context
        .get_program_parameter(&program, WebGlRenderingContext::LINK_STATUS)
        .as_bool()
        .unwrap_or(false)
    {
        Ok(program)
    } else {
        Err(context
            .get_program_info_log(&program)
            .unwrap_or_else(|| String::from("Unknown error creating program object")))
    }
}

pub fn create_vbo(context: &WebGlRenderingContext) -> Option<web_sys::WebGlBuffer> {
    // 頂点からVBO作成
    let buffer = context.create_buffer().ok_or("failed to create buffer").unwrap();
    context.bind_buffer(WebGlRenderingContext::ARRAY_BUFFER, Some(&buffer));

    // let vertices: [f32; 9] = [-0.7, -0.7, 0.0, 0.7, -0.7, 0.0, 0.0, 0.7, 0.0];
    let vertices: [f32; 12] = [
        -1.0,  1.0,  0.0,
        1.0,  1.0,  0.0,
        -1.0, -1.0,  0.0,
        1.0, -1.0,  0.0
    ];

    unsafe {
        let vert_array = js_sys::Float32Array::view(&vertices);

        context.buffer_data_with_array_buffer_view(
            WebGlRenderingContext::ARRAY_BUFFER,
            &vert_array,
            WebGlRenderingContext::STATIC_DRAW,
        );
    };

    Some(buffer)
}

pub fn create_ibo(context: &WebGlRenderingContext) -> Option<web_sys::WebGlBuffer> {
    let buffer = context.create_buffer().ok_or("failed to create buffer").unwrap();
    context.bind_buffer(WebGlRenderingContext::ELEMENT_ARRAY_BUFFER, Some(&buffer));

    let index: [i16; 6] = [
        0, 2, 1,
        1, 2, 3
    ];

    unsafe {
        let frag_array = js_sys::Int16Array::view(&index);

        context.buffer_data_with_array_buffer_view(
            WebGlRenderingContext::ELEMENT_ARRAY_BUFFER,
            &frag_array,
            WebGlRenderingContext::STATIC_DRAW,
        );
    };

    Some(buffer)
}
