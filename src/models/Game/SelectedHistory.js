class SelectedHistory {
  constructor() {
    this._listBox = [];
  }

  get list() {
    return this._listBox;
  }

  add(box) {
    this._listBox.push(box);
  }

  remove(boxId) {
    this._listBox = this._listBox.filter(box => box.boxId !== boxId);
    // emit to clients
  }

  exist(boxId) {
    const value = this._listBox.filter(box => box.boxId === boxId);
    return value.length > 0;
  }

  clean() {
    this._listBox = [];
  }

  length() {
    return this._listBox.length;
  }
}

export default SelectedHistory;
