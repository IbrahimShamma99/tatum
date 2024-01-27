import { Token, TokenType } from './types'

export class Scanner {
  public tokens: Token[] = []
  private current: number = 0
  private start: number = 0
  private line: number = 1

  constructor(private readonly source: string) {
    this.source = this.source.toLowerCase().trim()
  }

  scan() {
    while (!this.isAtEnd) {
      this.start = this.current
      this.scanTokens()
      this.advance()
    }
    this.addEOF()
  }

  scanTokens() {
    const char = this.peek
    switch (char) {
      case ' ':
      case '\r':
      case '\t':
        break
      case '\n':
        this.line++
        break
      case 't':
        while (this.isCurrentChar) {
          this.advance()
        }
        if (this.lexeme === 'true') {
          this.addToken(TokenType.TRUE)
        } else {
          throw new Error('Invalid token')
        }
        break
      case 'f':
        while (this.isCurrentChar) {
          this.advance()
        }
        if (this.lexeme === 'false') {
          this.addToken(TokenType.FALSE)
        } else {
          throw new Error('Invalid token')
        }
        break
      case '[':
        this.addToken(TokenType.SQUARE_RIGHT_BRACKET, '[')
        break
      case ']':
        this.addToken(TokenType.SQUARE_LEFT_BRACKET, ']')
        break
      case '{':
        this.addToken(TokenType.RIGHT_BRACKET, '{')
        break
      case '}':
        this.addToken(TokenType.LEFT_BRACKET, '}')
        break
      case ':':
        this.addToken(TokenType.COLON, ':')
        break
      case ',':
        this.addToken(TokenType.COMMA, ',')
        break
      case '.':
        this.addToken(TokenType.DOT, '.')
        break
      case '"':
        this.string()
        break
      default:
        if (this.isCurrentNumber) {
          this.number()
          break
        }
        throw new Error('Not implemented yet')
    }
  }

  get peek(): string {
    return this.source[this.current]
  }

  get peekNext(): string {
    return this.source[this.current + 1]
  }

  get isAtEnd(): boolean {
    return this.current >= this.source.length
  }

  get currentToken(): Token {
    return this.tokens[this.current - 1]
  }

  get lexeme() {
    return this.source.substring(this.start, this.current)
  }

  get isCurrentNumber() {
    return this.peek >= '0' && this.peek <= '9'
  }

  get isCurrentChar() {
    return this.peek >= 'a' && this.peek <= 'z'
  }

  match(lexeme: string) {
    if (this.peek === lexeme) {
      this.advance()
      return true
    }
    return false
  }

  advance() {
    this.current++
  }

  addToken(type: TokenType, initLexeme?: string) {
    this.tokens.push({
      lexeme: initLexeme ?? this.lexeme,
      line: this.line,
      end: this.current,
      start: this.start,
      type: type,
    })
  }

  addEOF() {
    this.tokens.push(
      new Token({
        lexeme: '\0',
        end: this.source.length,
        start: this.source.length,
        line: this.line,
        type: TokenType.EOF,
      })
    )
  }

  string() {
    this.advance()
    while (this.peek !== '"') {
      this.advance()
    }
    if (this.peekNext === ':') {
      this.addToken(
        TokenType.IDENTIFIER,
        this.source.substring(this.start + 1, this.current)
      )
    } else {
      this.addToken(
        TokenType.STRING,
        this.source.substring(this.start + 1, this.current)
      )
    }
  }

  number() {
    while (this.isCurrentNumber) {
      this.advance()
    }
    if (this.peek === TokenType.DOT) {
      while (this.isCurrentNumber) {
        this.advance()
      }
    }
    this.addToken(TokenType.NUMBER)
  }
}
