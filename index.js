const moment = require('moment');
const {Readable, Writable, Transform} = require('stream');
const fs = require('fs');

class MyReadable extends Readable {
  _read() {
    const date = new Date();
    setTimeout(() => this.push(date.toString()), 1000);
  }
}

class MyTransform extends Transform {
  _transform(data, enc, done) {
    const date = new Date(data);
    const formattedText = moment(date).format('MMMM Do YYYY, h:mm:ss a').toString() + "\n";
    this.push(formattedText)
    done();
  }
}

class MyWritable extends Writable {
  constructor() {
    super();
    this.file = fs.openSync('datetime.txt', 'w+');
  }

  _write(data, enc, done) {
    fs.write(this.file, data.toString(), () => {
      done();
    })
  }
}

const readableStream = new MyReadable();
const writableStream = new MyWritable();
const transformStream = new MyTransform();

readableStream.pipe(transformStream).pipe(writableStream);
