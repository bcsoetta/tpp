// chunk array into several n-length pieces
const chunk = (arr, size) => (Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
        arr.slice(i * size, i * size + size)
    ))

export {
    chunk
}