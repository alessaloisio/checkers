class SelectedHistory {
  constructor() {
    this.listBox = [];
  }

  add(box) {
    this.listBox.push(box);
  }

  remove(idBox) {
    this.listBox = this.listBox.filter(box => box.boxSelected !== idBox);
    // emit to clients
  }

  exist(idBox) {
    const value = this.listBox.filter(box => box.boxSelected === idBox);
    return value.length > 0;
  }

  clean() {
    this.listBox = [];
  }
}

export default SelectedHistory;
