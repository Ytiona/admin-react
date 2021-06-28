
window.lStore = {
  get: function (key) {
    return JSON.safaParse(localStorage.getItem(key));
  },
  set: function (key, value) {
    return localStorage.setItem(key, JSON.stringify(value));
  },
  remove: function (key) {
    return localStorage.removeItem(key);
  },
  clear: function () {
    return localStorage.clear();
  }
}