import { defineComponent } from "./component.js";
import { hFragment, h, hString } from "./h.js";

const TestComponent = defineComponent({
  state() {
    return {
      count: 0,
      modifyDom: false,
    };
  },

  test() {
    const newState = { ...this.state, modifyDom: !this.state.modifyDom };
    this.updateState(newState);
    console.log(newState);
  },

  render() {
    return hFragment([
      h(`${this.state.modifyDom === true ? "p" : "span"}`, {}, [
        hString("span"),
      ]),
      h(`${this.state.modifyDom === true ? "p" : "span"}`, {}, [
        hString("paragrap"),
      ]),
      h(
        "button",
        {
          on: {
            click: () => this.test(),
          },
        },
        ["-"],
      ),
    ]);
  },
});

const Counter = defineComponent({
  state() {
    return {
      count: 0,
    };
  },
  render() {
    return hFragment([
      h(
        "button",
        {
          on: {
            click: () =>
              this.updateState({ ...this.state, count: this.state.count - 1 }),
          },
        },
        ["-"],
      ),
      h(
        "span",
        { class: `${this.state.count < 0 ? "negative" : "positive"}` },
        [
          hString(
            `${this.state.count} is ${this.state.loading ? "loading" : "displayed"} `,
          ),
        ],
      ),
      h(
        "button",
        {
          on: {
            click: () => {
              console.log("na trigger ba to");
              this.updateState({ ...this.state, count: this.state.count + 1 });
            },
          },
        },
        ["+"],
      ),
      h(
        "button",
        {
          on: {
            click: () => this.loading(),
          },
        },
        ["Load"],
      ),
      h(TestComponent),
    ]);
  },
  loading() {
    console.log("d nmn to nag trigger");
    this.updateState({ ...this.state, loading: true });
    setTimeout(() => {
      this.updateState({ ...this.state, loading: false });
    }, 3000);
  },
});

const initialProps = {
  count: 0,
};

export const counterComponent = new Counter({ initialProps });
