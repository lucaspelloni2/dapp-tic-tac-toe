class Transaction {
  constructor(data = {}) {
    this.tx = null;
    this.confirmed = false;
    this.gameName = null;
    this.blockNumber = null;
    this.status = null;
    Object.assign(this, data);
  }
}
export default Transaction;
