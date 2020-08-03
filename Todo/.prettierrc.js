module.exports = {
  "tabWidth": 2, // 一个tab代表几个空格数，默认2
  "useTabs": false, // 是否使用tab进行缩进，默认false
  "singleQuote": true,// 字符串是否使用单引号，默认false
  "trailingComma": "es5",// 是否使用尾逗号，可选值"<none|es5|all>"，默认none
  "printWidth": 120,// 每行最大字符数，超过会换行，默认80
  "endOfLine": "auto",// 行尾换行方式，可选值"<auto|lf|crlf|cr>"，默认auto
  "overrides": [
    {
      "files": ".prettierrc",
      "options": { "parser": "json" }
    }
  ]
}
