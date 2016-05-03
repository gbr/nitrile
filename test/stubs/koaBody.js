export const generator = function *gen(next) {
  yield next;
};

export default function () {
  return generator;
}
