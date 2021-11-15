const context = require['context']('./',true,/\.ts$/);
export default context.keys().filter((item: string) => {
  // 只导出model
  if(context(item) && context(item).default && context(item).default.namespace){
    return true;
  }
  return false;
}).map((key: string) => context(key));