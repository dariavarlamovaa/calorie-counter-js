const numberFormat = (num) => {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, `$1 `);
};  

export default class Result {
  constructor(element) {
    this.calculator = element;
    this.root = this.calculator.querySelector(`.counter__result`);
    this.caloriesNorm = this.root.querySelector(`#calories-norm`)
    this.caloriesMin = this.root.querySelector(`#calories-minimal`)
    this.caloriesMax = this.root.querySelector(`#calories-maximal`)
  }

  show(calories) {
    this.caloriesNorm.textContent = numberFormat(calories.normal)
    this.caloriesMin.textContent = numberFormat(calories.minimal)
    this.caloriesMax.textContent = numberFormat(calories.maximal)
    this.root.classList.remove(`counter__result--hidden`)
  }

  hide() {
    this.root.classList.add(`counter__result--hidden`);
    this.caloriesNorm.textContent = 0;
    this.caloriesMin.textContent = 0;
    this.caloriesMax.textContent = 0;
  }
}
