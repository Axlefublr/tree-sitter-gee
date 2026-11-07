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
    [$.italic, $._stray],
    [$.strikethrough, $._stray_in_italic],
    [$.strikethrough, $._stray],
    [$.bold, $._stray_in_italic],
    [$.bold, $._stray_in_strikethrough],
    [$.bold, $._stray],
  ],

  rules: {
    source_file: $ => repeat(choice($._separator, $._block)),

    _block: $ => choice($.paragraph, $.codeblock, $.heading1, $.heading2, $.heading3, $.heading4, $.heading5, $.heading6),

    codeblock: $ => prec.right(seq(seq(optional($._space), '```', optional($.language_name), $._newline), optional($.inner_codeblock), seq(optional($._space), '```', $._newline))),

    heading6: $ => prec.right(seq(optional($._space), $.heading6_header, $._newline, optional($.heading6_contents))),
    heading5: $ => prec.right(seq(optional($._space), $.heading5_header, $._newline, optional($.heading5_contents))),
    heading4: $ => prec.right(seq(optional($._space), $.heading4_header, $._newline, optional($.heading4_contents))),
    heading3: $ => prec.right(seq(optional($._space), $.heading3_header, $._newline, optional($.heading3_contents))),
    heading2: $ => prec.right(seq(optional($._space), $.heading2_header, $._newline, optional($.heading2_contents))),
    heading1: $ => prec.right(seq(optional($._space), $.heading1_header, $._newline, optional($.heading1_contents))),

    heading6_header: $ => choice(seq('###### ', $.heading_title), $.heading6_line),
    heading5_header: $ => choice(seq('##### ', $.heading_title), $.heading5_line),
    heading4_header: $ => choice(seq('#### ', $.heading_title), $.heading4_line),
    heading3_header: $ => choice(seq('### ', $.heading_title), $.heading3_line),
    heading2_header: $ => choice(seq('## ', $.heading_title), $.heading2_line),
    heading1_header: $ => choice(seq('# ', $.heading_title), $.heading1_line),

    heading6_line: _ => '━━━━━━',
    heading5_line: _ => '━━━━━',
    heading4_line: _ => '━━━━',
    heading3_line: _ => '━━━',
    heading2_line: _ => '━━',
    heading1_line: _ => '━',

    heading6_contents: $ => prec.right(repeat1(choice($.paragraph, $.codeblock, $._separator))),
    heading5_contents: $ => prec.right(repeat1(choice($.paragraph, $.codeblock, $.heading6, $._separator))),
    heading4_contents: $ => prec.right(repeat1(choice($.paragraph, $.codeblock, $.heading5, $.heading6, $._separator))),
    heading3_contents: $ => prec.right(repeat1(choice($.paragraph, $.codeblock, $.heading4, $.heading5, $.heading6, $._separator))),
    heading2_contents: $ => prec.right(repeat1(choice($.paragraph, $.codeblock, $.heading3, $.heading4, $.heading5, $.heading6, $._separator))),
    heading1_contents: $ => prec.right(repeat1(choice($.paragraph, $.codeblock, $.heading2, $.heading3, $.heading4, $.heading5, $.heading6, $._separator))),

    heading_title: $ => $._anything,

    inner_codeblock: $ => repeat1(seq($._anything, $._newline)),

    paragraph: $ => prec.right(repeat1($.line)),

    line: $ => seq(
      repeat1(choice($._space, $._word)),
      $._newline
    ),

    _word_italic: $ => choice($.bold, $.strikethrough, repeat1(choice($._stray_in_italic, $._plain))),
    _word_strikethrough: $ => choice($.bold, repeat1(choice($._stray_in_strikethrough, $._raw_in_strikethrough, $._plain))),
    _word_bold: $ => repeat1(choice($._raw_in_bold, $._plain)),
    _word: $ => choice($.bold, $.strikethrough, $.italic, $.code, $.reference, $._plain, $._stray),

    inner_reference:       $ => $._plain_reference,
    inner_code:            $ => $._plain_code,
    inner_italic:          $ => seq($._word_italic, repeat(seq($._space, $._word_italic))),
    inner_strikethrough:   $ => seq($._word_strikethrough, repeat(seq($._space, $._word_strikethrough))),
    inner_bold:            $ => seq($._word_bold,   repeat(seq($._space, $._word_bold))),

    code: $ => prec.right(10, seq('`', choice(
      optional(seq('`', optional($.language_name))),
      seq($.inner_code, optional(seq('`', optional($.language_name))))
    ))),
    reference: $ => prec.right(9, seq('«', optional($.inner_reference), optional('»'))),
    italic:       $ => prec.dynamic(1, seq('_', $.inner_italic, '_')),
    strikethrough:   $ => prec.dynamic(1, seq('~', $.inner_strikethrough, '~')),
    bold:            $ => prec.dynamic(1, seq('*', $.inner_bold, '*')),

    language_name: _ => /[a-z]+/,

    _raw_in_strikethrough: _ => '_',
    _raw_in_bold: _ => choice('~', '_'),

    _stray_in_italic: _ => choice('*', '~'),
    _stray_in_strikethrough: _ => '*',

    _stray: _ => choice('*', '~', '_', '`', '«', '»'),
    _plain_code: _ => /[^\n`]+/,
    _plain_reference: _ => /[^\n»]+/,
    _plain: _ => /[^\s*~`_«»]+/,
    _anything: _ => /[^\n]+/,

    _separator: _ => /(([ \t]*)\n)+/,
    _newline: _ => "\n",
    _space: _ => /[ \t]+/,
  }
});
