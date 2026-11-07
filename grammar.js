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
    [$.heading1_contents],
    [$.heading2_contents],
    [$.heading3_contents],
    [$.heading4_contents],
    [$.heading5_contents],
    [$.heading6_contents],
    [$.heading1],
    [$.heading2],
    [$.heading3],
    [$.heading4],
    [$.heading5],
    [$.heading6],
    [$.paragraph],
    [$.underline, $._stray],
    [$.strikethrough, $._stray_in_underline],
    [$.strikethrough, $._stray],
    [$.bold, $._stray_in_underline],
    [$.bold, $._stray_in_strikethrough],
    [$.bold, $._stray],
    [$.italic, $._stray_in_underline],
    [$.italic, $._stray_in_strikethrough],
    [$.italic, $._stray_in_bold],
    [$.italic, $._stray],
  ],

  rules: {
    source_file: $ => repeat(choice($._separator, $._block)),

    _block: $ => choice($.paragraph, $.heading1, $.heading2, $.heading3, $.heading4, $.heading5, $.heading6),

    heading6: $ => seq(optional($._space), $.heading6_header, $._newline, optional($.heading6_contents)),
    heading5: $ => seq(optional($._space), $.heading5_header, $._newline, optional($.heading5_contents)),
    heading4: $ => seq(optional($._space), $.heading4_header, $._newline, optional($.heading4_contents)),
    heading3: $ => seq(optional($._space), $.heading3_header, $._newline, optional($.heading3_contents)),
    heading2: $ => seq(optional($._space), $.heading2_header, $._newline, optional($.heading2_contents)),
    heading1: $ => seq(optional($._space), $.heading1_header, $._newline, optional($.heading1_contents)),

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

    heading6_contents: $ => prec.dynamic(100, repeat1(choice($.paragraph, $._separator))),
    heading5_contents: $ => prec.dynamic(100, repeat1(choice($.paragraph, $.heading6, $._separator))),
    heading4_contents: $ => prec.dynamic(100, repeat1(choice($.paragraph, $.heading5, $.heading6, $._separator))),
    heading3_contents: $ => prec.dynamic(100, repeat1(choice($.paragraph, $.heading4, $.heading5, $.heading6, $._separator))),
    heading2_contents: $ => prec.dynamic(100, repeat1(choice($.paragraph, $.heading3, $.heading4, $.heading5, $.heading6, $._separator))),
    heading1_contents: $ => prec.dynamic(100, repeat1(choice($.paragraph, $.heading2, $.heading3, $.heading4, $.heading5, $.heading6, $._separator))),

    heading_title: $ => $._anything,

    paragraph: $ => prec.dynamic(-1, repeat1($.line)),

    line: $ => seq(
      repeat1(choice($._space, $._word)),
      $._newline
    ),

    // underline > strikethrough > bold > italic
    // i.e. italic cannot contain a bold inside of it, a bold cannot contain a strikethrough inside of it, etc
    // underline can contain strikethrough / bold / italic
    // strikethrough can contain bold / italic but not underline
    // you cannot double bold something, you'll just end up with two stray `*` on each side, with a plain word on the inside
    // (the above is the intention, at least)

    _word_underline: $ => choice($.italic, $.bold, $.strikethrough, repeat1(choice($._stray_in_underline, $._plain))),
    _word_strikethrough: $ => choice($.italic, $.bold, repeat1(choice($._stray_in_strikethrough, $._raw_in_strikethrough, $._plain))),
    _word_bold: $ => choice($.italic, repeat1(choice($._stray_in_bold, $._raw_in_bold, $._plain))),
    _word_italic: $ => repeat1(choice($._raw_in_italic, $._plain)),
    _word: $ => choice($.italic, $.bold, $.strikethrough, $.underline, $.code, $._plain, $._stray),

    inner_code:            $ => $._plain_code,
    inner_underline:       $ => seq($._word_underline, repeat(seq($._space, $._word_underline))),
    inner_strikethrough:   $ => seq($._word_strikethrough, repeat(seq($._space, $._word_strikethrough))),
    inner_bold:            $ => seq($._word_bold,   repeat(seq($._space, $._word_bold))),
    inner_italic:          $ => seq($._word_italic, repeat(seq($._space, $._word_italic))),

    code: $ => prec.right(10, seq('`', choice(
      optional(seq('`', optional($.language_name))),
      seq($.inner_code, optional(seq('`', optional($.language_name))))
    ))),
    underline:       $ => prec.dynamic(1, seq('_', $.inner_underline, '_')),
    strikethrough:   $ => prec.dynamic(1, seq('~', $.inner_strikethrough, '~')),
    bold:            $ => prec.dynamic(1, seq('*', $.inner_bold, '*')),
    italic:          $ => prec.dynamic(1, seq('/', $.inner_italic, '/')),

    language_name: _ => /[a-z]+/,

    _raw_in_strikethrough: _ => '_',
    _raw_in_bold: _ => choice('~', '_'),
    _raw_in_italic: _ => choice('*', '~', '_'),

    _stray_in_underline: _ => choice('/', '*', '~'),
    _stray_in_strikethrough: _ => choice('/', '*'),
    _stray_in_bold: _ => '/',

    _stray: _ => choice('/', '*', '~', '_', '`'),
    _plain_code: _ => /[^\n`]+/,
    _plain: _ => /[^\s/*~`_]+/,
    _anything: _ => /[^\n]+/,

    _separator: _ => /(([ \t]*)\n)+/,
    _newline: _ => "\n",
    _space: _ => /[ \t]+/,
  }
});
