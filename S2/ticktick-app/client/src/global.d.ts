declare function require(path: string): any;
declare namespace require {
  function context(
    path: string,
    deep?: boolean,
    filter?: RegExp
  ): {
    keys: () => string[];
    (id: string): { default: React.ComponentType<any> };
  };
}