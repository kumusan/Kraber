use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;
use web_sys::{WebGlProgram, WebGlRenderingContext, WebGlShader};

#[wasm_bindgen(start)]
pub fn start() -> Result<(), JsValue> {
    run_shader(false, "", "")
}

#[wasm_bindgen]
pub fn run_shader(change: bool, vert_value: &str, frag_value: &str) -> Result<(), JsValue> {
    let document = web_sys::window().unwrap().document().unwrap();
    let canvas = document.get_element_by_id("canvas").unwrap();
    let canvas: web_sys::HtmlCanvasElement = canvas.dyn_into::<web_sys::HtmlCanvasElement>()?;

    let context = canvas
        .get_context("webgl")?
        .unwrap()
        .dyn_into::<WebGlRenderingContext>()?;

    //////////////////////////////////////////////////////////////////////
    // 今後最適化
    if !change {
        let vert_shader = compile_shader(
            &context,
            WebGlRenderingContext::VERTEX_SHADER,
            r#"
            attribute vec4 position;
            void main() {
                gl_Position = position;
            }
        "#,
        )?;
        let frag_shader = compile_shader(
            &context,
            WebGlRenderingContext::FRAGMENT_SHADER,
            r#"
            void main() {
                gl_FragColor = vec4(0.1, 1.0, 1.0, 1.0);
            }
        "#,
        )?;
        let program = link_program(&context, &vert_shader, &frag_shader)?;
        context.use_program(Some(&program));
    } else {
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
    }

    ///////////////////////////////////////////////////////////////////////////////

    let vertices: [f32; 9] = [-0.7, -0.7, 0.0, 0.7, -0.7, 0.0, 0.0, 0.7, 0.0];

    let buffer = context.create_buffer().ok_or("failed to create buffer")?;
    context.bind_buffer(WebGlRenderingContext::ARRAY_BUFFER, Some(&buffer));

    unsafe {
        let vert_array = js_sys::Float32Array::view(&vertices);

        context.buffer_data_with_array_buffer_view(
            WebGlRenderingContext::ARRAY_BUFFER,
            &vert_array,
            WebGlRenderingContext::STATIC_DRAW,
        );
    }

    context.vertex_attrib_pointer_with_i32(0, 3, WebGlRenderingContext::FLOAT, false, 0, 0);
    context.enable_vertex_attrib_array(0);

    context.clear_color(0.0, 0.0, 0.0, 1.0);
    context.clear(WebGlRenderingContext::COLOR_BUFFER_BIT);

    context.draw_arrays(
        WebGlRenderingContext::TRIANGLES,
        0,
        (vertices.len() / 3) as i32,
    );
    Ok(())
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

#[wasm_bindgen]
pub fn add_test(a: u32, b: u32) -> u32 {
    a + b
}

#[wasm_bindgen]
pub fn rerendering(size: &str) -> Result<(), JsValue> {
    
    let document = web_sys::window().unwrap().document().unwrap();
    let h = document.get_element_by_id("wasmcall").unwrap();
    h.set_inner_html(size);

    Ok(())
}