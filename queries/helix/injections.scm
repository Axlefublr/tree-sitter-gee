(code
  (inner_code) @injection.content (#set! injection.include-unnamed-children)
  (language_name) @injection.language
)

(code
  (inner_code) @injection.content
  (language_name) @_language
  (#eq? @_language "cr")
  (#set! injection.language "crystal")
  (#set! injection.include-unnamed-children)
)

(codeblock
  (language_name) @injection.language
  (inner_codeblock) @injection.content (#set! injection.include-unnamed-children)
)

(codeblock
  (language_name) @_language
  (inner_codeblock) @injection.content
  (#eq? @_language "cr")
  (#set! injection.language "crystal")
  (#set! injection.include-unnamed-children)
)
