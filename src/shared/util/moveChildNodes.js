
export default (container, start, end = null, before = null) => {
  while (start !== end) {
    const node = start.nextSibling;

    container.insertBefore(start, before);
    start = node;
  }
};
