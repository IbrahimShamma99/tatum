import { Scanner } from './scanner'
import { Parser } from './parser'
import { TSVisitor } from './visitors/ts.visitor'
import { FormatterVisitor } from './visitors/formatter.visitor'

const args = process.argv.slice(2)

if (args.length && false) {
  const jsonData: string = args[0]
  const scanner = new Scanner(jsonData)
  scanner.scan()
  const parser = new Parser(scanner.tokens)
  parser.parse()
  const inferredType = new TSVisitor().execute(parser.tree, 'TypeName')
  console.log(inferredType)
}

export { Scanner, Parser, TSVisitor, FormatterVisitor }
