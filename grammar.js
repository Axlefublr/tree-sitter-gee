/**
 * @file Gee grammar for tree-sitter
 * @author Axlefublr <axlefublr.ls@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

export default grammar({
  name: "gee",

  extras: _ => [],

  conflicts: $ => [
    [$._word_triangle, $.bracket],
    [$._word_bracket, $.triangle],
    [$._word_strikethrough, $.italibold],
    [$._word_strikethrough, $.bold],
    [$._word_strikethrough, $.italic],
    [$.strikethrough, $._stray],
    [$.italibold, $._stray],
    [$.bold, $._stray],
    [$.italic, $._stray],
    [$.triangle, $._stray],
    [$.bracket, $._stray],
  ],

  rules: {
    source_file: $ => repeat(choice($._separator, $._block)),

    _block: $ => choice($.paragraph, $.codeblock, $.heading1, $.heading2, $.heading3, $.heading4, $.heading5, $.heading6),

    codeblock: $ => prec.right(choice(
      seq(
        seq(
          $._codeblock_delimiter, optional($.language_name), $._newline
        ),
        optional($.inner_codeblock),
        seq(
          $._codeblock_delimiter, $._newline
        )
      ),
      seq(
        seq(
          $._stronger_codeblock_delimiter, optional($.language_name), $._newline
        ),
        optional($.inner_codeblock),
        seq(
          $._stronger_codeblock_delimiter, $._newline
        )
      )
    )),

    _codeblock_delimiter: _ => token(seq(/[ \t]*/, '```')),
    _stronger_codeblock_delimiter: _ => token(seq(/[ \t]*/, '````')),

    heading6: $ => prec.right(seq($.heading6_header, $._newline, optional($.heading6_contents))),
    heading5: $ => prec.right(seq($.heading5_header, $._newline, optional($.heading5_contents))),
    heading4: $ => prec.right(seq($.heading4_header, $._newline, optional($.heading4_contents))),
    heading3: $ => prec.right(seq($.heading3_header, $._newline, optional($.heading3_contents))),
    heading2: $ => prec.right(seq($.heading2_header, $._newline, optional($.heading2_contents))),
    heading1: $ => prec.right(seq($.heading1_header, $._newline, optional($.heading1_contents))),

    heading6_header: $ => choice(seq($._heading6_hash, $.heading_title), $.heading6_line),
    heading5_header: $ => choice(seq($._heading5_hash, $.heading_title), $.heading5_line),
    heading4_header: $ => choice(seq($._heading4_hash, $.heading_title), $.heading4_line),
    heading3_header: $ => choice(seq($._heading3_hash, $.heading_title), $.heading3_line),
    heading2_header: $ => choice(seq($._heading2_hash, $.heading_title), $.heading2_line),
    heading1_header: $ => choice(seq($._heading1_hash, $.heading_title), $.heading1_line),

    _heading6_hash: _ => token(seq(/[ \t]*/, '###### ')),
    _heading5_hash: _ => token(seq(/[ \t]*/, '##### ')),
    _heading4_hash: _ => token(seq(/[ \t]*/, '#### ')),
    _heading3_hash: _ => token(seq(/[ \t]*/, '### ')),
    _heading2_hash: _ => token(seq(/[ \t]*/, '## ')),
    _heading1_hash: _ => token(seq(/[ \t]*/, '# ')),
    heading6_line: _ => token(seq(/[ \t]*/, '━━━━━━')),
    heading5_line: _ => token(seq(/[ \t]*/, '━━━━━')),
    heading4_line: _ => token(seq(/[ \t]*/, '━━━━')),
    heading3_line: _ => token(seq(/[ \t]*/, '━━━')),
    heading2_line: _ => token(seq(/[ \t]*/, '━━')),
    heading1_line: _ => token(seq(/[ \t]*/, '━')),

    heading6_contents: $ => prec.right(repeat1(choice($.paragraph, $.codeblock, $._separator))),
    heading5_contents: $ => prec.right(repeat1(choice($.paragraph, $.codeblock, $.heading6, $._separator))),
    heading4_contents: $ => prec.right(repeat1(choice($.paragraph, $.codeblock, $.heading5, $.heading6, $._separator))),
    heading3_contents: $ => prec.right(repeat1(choice($.paragraph, $.codeblock, $.heading4, $.heading5, $.heading6, $._separator))),
    heading2_contents: $ => prec.right(repeat1(choice($.paragraph, $.codeblock, $.heading3, $.heading4, $.heading5, $.heading6, $._separator))),
    heading1_contents: $ => prec.right(repeat1(choice($.paragraph, $.codeblock, $.heading2, $.heading3, $.heading4, $.heading5, $.heading6, $._separator))),

    heading_title: $ => $._anything,

    inner_codeblock: $ => repeat1(choice($._anything, $._newline)),

    paragraph: $ => prec.right(repeat1($._line)),

    _line: $ => seq(
      repeat1(choice($._space, $._word)),
      $._newline
    ),

    _word_triangle: $ => choice($.bracket, repeat1(choice($._plain, $._raw_markup, '[', ']'))),
    _word_bracket: $ => choice($.triangle, repeat1(choice($._plain, $._raw_markup, '<', '>'))),
    _word_strikethrough: $ => choice($.bold, $.italic, $.italibold, repeat1(choice('*', '**', '***', $._raw, $._plain))),
    _word_italibold: $ => repeat1(choice('~~', '*', '**', $._raw, $._plain)),
    _word_bold: $ => repeat1(choice('~~', '*', '***', $._raw, $._plain)),
    _word_italic: $ => repeat1(choice('~~', '**', '***', $._raw, $._plain)),

    _word: $ => choice(
      $.strikethrough,
      $.italibold,
      $.bold,
      $.italic,
      $.code,
      $.reference,
      $.bracket,
      $.typed_bracket,
      $.triangle,
      $.typed_triangle,
      $.semantic_operator,
      $.return_expression,
      $._plain_text,
      $._stray
    ),

    inner_reference:     $ => $._plain_reference,
    inner_code:          $ => $._plain_code,
    inner_triangle:      $ => seq($._word_triangle, repeat(seq($._space, $._word_triangle))),
    inner_bracket:       $ => seq($._word_bracket, repeat(seq($._space, $._word_bracket))),

    inner_strikethrough: $ => seq($._word_strikethrough, repeat(seq($._space, $._word_strikethrough))),
    inner_italibold:     $ => seq($._word_italibold, repeat(seq($._space, $._word_italibold))),
    inner_bold:          $ => seq($._word_bold, repeat(seq($._space, $._word_bold))),
    inner_italic:        $ => seq($._word_italic, repeat(seq($._space, $._word_italic))),

    attached_type: $ => seq($.type, optional($._value_expression)),
    type: $ => repeat1(choice(seq($.type_word, optional($.nulling_operator)), $._type_shenanigan)),
    _type_shenanigan: _ => token(prec(3, /[^\s≔]/)),
    _value_expression: $ => seq(token(prec(3, '≔')), optional($.value)),
    nulling_operator: _ => token(prec(5, '?')),
    _type_announcer: $ => token(prec(3, ':')),
    type_word: _ => token(prec(4, /\w+/)),
    value: _ => token(prec(3, /[^\s]+/)),

    code: $ => prec.right(10, seq('`', choice(
      optional(seq('`', optional($.language_marker))),
      seq($.inner_code, optional(seq('`', optional($.language_marker))))
    ))),
    reference: $ => prec.right(9, seq('«', choice(
      optional('»'),
      seq($.inner_reference, optional('»'))
    ))),

    typed_bracket: $ => prec(2, seq(
      $.bracket, choice(
        seq($._type_announcer, optional($.attached_type)),
        $._value_expression
      )
    )),
    typed_triangle: $ => prec(2, seq(
      $.triangle, choice(
        seq($._type_announcer, optional($.attached_type)),
        $._value_expression
      )
    )),

    bracket: $ => prec.dynamic(100,  seq('[', $.inner_bracket, ']')),
    triangle: $ => prec.dynamic(100, seq('<', $.inner_triangle, '>')),

    strikethrough: $ => prec.dynamic(100, seq('~~', $.inner_strikethrough, '~~')),
    italibold:     $ => prec.dynamic(25, seq('***', $.inner_italibold, '***')),
    bold:          $ => prec.dynamic(5, seq('**', $.inner_bold, '**')),
    italic:        $ => prec.dynamic(1, seq('*', $.inner_italic, '*')),

    language_marker: $ => seq(choice(token(prec(1, ';')), token(prec(1, ':'))), optional($.language_name)),
    language_name: _ => /[\w-]+/,

    _raw_markup: _ => choice('*', '**', '***', '~', '~~', '`', '«', '»'),
    _raw: _ => choice('[', ']', '<', '>', '~'),
    _stray: _ => prec.dynamic(-1000, choice('*', '**', '***', '~~', '~', '[', ']', '<', '>')),

    _plain_code: _ => token(prec(10, /[^\n`]+/)),
    _plain_reference: _ => token(prec(9, /[^\n»]+/)),
    return_operator: _ => '⇉',
    _return_operator: _ => '⇉',
    return_expression: $ => seq($.return_operator, optional($.type)),
    _semantic_operator: _ => /[⇇⇊⇈↔↕⥯⇌]+/,
    semantic_operator: _ => /[⇇⇊⇈↔↕⥯⇌]+/,
    _plain: $ => choice($._plain_text, $._semantic_operator, $._return_operator),
    _plain_text: _ => /[^\s*~`«»\[\]<>⇇⇊⇈⇉↔↕⥯⇌]+/,

    _separator: _ => /(([ \t]*)\n)+/,
    _space: _ => /[ \t]+/,
    _anything: _ => /[^\n]+/,
    _newline: _ => "\n",
  }
});
