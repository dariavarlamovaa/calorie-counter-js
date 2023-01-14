import Result from "./result.js";

const PhysicalActivityRatio = {
  MIN: 1.2,
  LOW: 1.375,
  MEDIUM: 1.55,
  HIGH: 1.725,
  MAX: 1.9,
};

const CaloriesFormulaFactor = {
  AGE: 5,
  WEIGHT: 10,
  HEIGHT: 6.25,
};

const CaloriesFormulaConstant = {
  MALE: -5,
  FEMALE: 161,
};

const CaloriesMinMaxRatio = {
  MIN: 0.85,
  MAX: 1.15,
};

const formInput = (input) => {
  return input.value.replace(/[^\d]/g, "").replace(/^0+/, "");
}

export default class Counter {
  constructor(element) {
    this.root = element;
    this.form = this.root.querySelector(".counter__form");
    this.elements = this.form.elements;
    this.parameters = this.elements.parameters.elements;
    this.itemParameters = Array.from(this.parameters);
    this.gender = this.form.gender;
    this.age = this.parameters.age;
    this.activity = this.elements.activity;
    this.height = this.parameters.height;
    this.weight = this.parameters.weight;
    this.submit = this.elements.submit;
    this.reset = this.elements.reset;
    this.onInput = this._onFormInput.bind(this);
    this.onReset = this._onFormReset.bind(this);
    this.onSubmit = this._onFormSubmit.bind(this);

    this.result = new Result(this.root);
  }

  _onFormInput() {
    this.submit.disabled = !this.form.checkValidity();
    this.reset.disabled = !this.itemParameters.some((el) => el.value);
    this.age.value = formInput(this.age);
    this.height.value = formInput(this.height)
    this.weight.value = formInput(this.weight);
  }

  _onFormReset() {
    this.submit.disabled = true
    this.reset.disabled = true
    this.result.hide()
  }

  _onFormSubmit(evt) {
    evt.preventDefault()

    const caloriesNorm = this.getCaloriesNorm()

    const calories = {
        normal: caloriesNorm,
        minimal: this.getCaloriesMin(caloriesNorm),
        maximal: this.getCaloriesMax(caloriesNorm)
    }
    
    this.result.show(calories);
  }

  init() {
    this.form.addEventListener("input", this.onInput, true);
    this.form.addEventListener("submit", this.onSubmit);
    this.form.addEventListener("reset", this.onReset);
  }

  deinit() {
    this.form.removeEventListener("input", this.onInput);
    this.form.removeEventListener("submit", this.onSubmit);
    this.form.removeEventListener("reset", this.onReset);
  }

  getActivityRatio() {
    const activity = PhysicalActivityRatio[this.activity.value.toUpperCase()];
    return activity
  }

  getCaloriesNorm() {
    const age = CaloriesFormulaFactor.AGE * this.age.value;
    const height = CaloriesFormulaFactor.HEIGHT * this.height.value
    const weight = CaloriesFormulaFactor.WEIGHT * this.weight.value;
    const gender = CaloriesFormulaConstant[this.gender.value.toUpperCase()];
    const activity = this.getActivityRatio()
    return Math.round(((weight + height - age) - gender) * activity);
  }

  getCaloriesMin() {
    return Math.round(this.getCaloriesNorm() * CaloriesMinMaxRatio.MIN);
  }

  getCaloriesMax() {
    return Math.round(this.getCaloriesNorm() * CaloriesMinMaxRatio.MAX);
  }
}
