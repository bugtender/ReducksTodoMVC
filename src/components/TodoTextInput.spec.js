import React from "react";
import { createRenderer } from "react-test-renderer/shallow";
import TodoTextInput from "./TodoTextInput";

const setup = propOverrides => {
  const props = Object.assign(
    {
      onSave: jest.fn(),
      text: "Interview with Helen",
      placeholder: "What needs to be done?",
      editing: false,
      newTodo: false
    },
    propOverrides
  );

  const renderer = createRenderer();

  renderer.render(<TodoTextInput {...props} />);

  const output = renderer.getRenderOutput();

  return {
    props: props,
    output: output,
    renderer: renderer
  };
};

describe("components", () => {
  describe("TodoTextInput", () => {
    it("should render correctly", () => {
      const { output } = setup();
      expect(output.props.placeholder).toEqual("What needs to be done?");
      expect(output.props.value).toEqual("Interview with Helen");
      expect(output.props.className).toEqual("");
    });

    it("should render correctly when editing=true", () => {
      const { output } = setup({ editing: true });
      expect(output.props.className).toEqual("edit");
    });

    it("should render correctly when newTodo=true", () => {
      const { output } = setup({ newTodo: true });
      expect(output.props.className).toEqual("new-todo");
    });

    it("should update value on change", () => {
      const { output, renderer } = setup();
      output.props.onChange({ target: { value: "Use Radox" } });
      const updated = renderer.getRenderOutput();
      expect(updated.props.value).toEqual("Use Radox");
    });

    it("should call onSave on return key press", () => {
      const { output, props } = setup();
      output.props.onKeyDown({ which: 13, target: { value: "Interview with Helen" } });
      expect(props.onSave).toBeCalledWith("Interview with Helen");
    });

    it("should reset state on return key press if newTodo", () => {
      const { output, renderer } = setup({ newTodo: true });
      output.props.onKeyDown({ which: 13, target: { value: "Interview with Helen" } });
      const updated = renderer.getRenderOutput();
      expect(updated.props.value).toEqual("");
    });

    it("should call onSave on blur", () => {
      const { output, props } = setup();
      output.props.onBlur({ target: { value: "Interview with Helen" } });
      expect(props.onSave).toBeCalledWith("Interview with Helen");
    });

    it("shouldnt call onSave on blur if newTodo", () => {
      const { output, props } = setup({ newTodo: true });
      output.props.onBlur({ target: { value: "Interview with Helen" } });
      expect(props.onSave).not.toBeCalled();
    });
  });
});
