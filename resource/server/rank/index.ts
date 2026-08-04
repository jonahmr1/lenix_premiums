const size = Buffer.byteLength(JSON.stringify({}), 'utf8')
console.log(`snapshot: ${(size / 1024).toFixed(2)} KB`)
