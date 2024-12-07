# GST Utils

Basic utilities for adding, subtracting and getting GST from a value. Has some simple sanitisation to strip out non numeric characters and always return a number.

## Installation
`npm install gst-utils`

## Usage
```js
import useGst from 'gst-utils';

const myValue = 100;

const { gst, amountInclusive, amountExclusive } = useGst(myValue);

console.log(gst) // 13.04
console.log(amountInclusive) // 115
console.log(amountExclusive) // 86.96

```

## Example
Visit [nzgst.netlify.app](https://nzgst.netlify.app)