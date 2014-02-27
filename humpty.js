/*
    Humpty.JS - Syntax Highlighter Library
    The MIT License - https://raw.github.com/kadymov/humpty.js/master/LICENSE
    Copyright (c) 2014 Aleksandr Kadymov (www.kadymov.pw)
*/

(function() {
    "use strict";

    var options = {
        autorun            : true,
        hideLineNumbers : false,
        alwaysOpen        : false,
        codeTags        : ['pre']        
    };

    var database = {
        'js': {
            'keyword'       :   [   'break',       'case',          'catch',
                                    'const',        'continue',     'debugger',
                                    'default',      'delete',       'do',
                                    'else',         'export',       'extends',
                                    'final',        'finally',      'for',
                                    'goto',         'if',           'implements',
                                    'import',       'in',           'instanceof',
                                    'native',       'new',          'package',
                                    'private',      'protected',    'public',
                                    'return',       'static',       'switch',
                                    'synchronized', 'throw ',       'throws',
                                    'transient',    'try',          'typeof',
                                    'volatile',     'while',        'with'
                                ],

            'declaration'   :   [   'boolean',      'byte',         'char',
                                    'double',       'enum',         'float',
                                    'function',     'int',          'interface',
                                    'long',         'short',        'var',
                                    'void'
                                ],

            'special'       :   ['prototype', 'super', 'this', 'window' ],

            'string'        :    /(&quot;|\').*?\1/gi,

            'value'         :    /\b(true|false|null|0x[\da-fA-F]+|\d+(\.\d+)?(e\d+)?)\b/g,

            'regexp'        :    /&frasl;[^+^*^?^&frasl;^\n^\r].+&frasl;[gim]*/gi,

            'line-comment'  :    /&frasl;&frasl;[^\n]+/gi,

            'block-comment' :    /&frasl;\*[\s\S]*?\*&frasl;/gi,
        },

        'html' : {
            'string'        :    /(&quot;|\').*?\1/gi,

            'tag'           :    /&lt;.+?&gt;/gi,

            'block-comment' :    /&lt;!--[\s\S]*?--&gt;/gi
        },

        'css' : {
            'selectors'     :    /[.#\w\[\]\=(&quot;)\']+\s*(?=,|{)/gi,

            'params'        :    /(\s[A-Za-z\-]+)(?=\s*:)/g,

            'string'        :    /(&quot;|\').*?\1/gi,

            'value'         :    /#[\dA-Za-z]{6}|#[\dA-Za-z]{3}|\d+(\.\d+)?(px|pt|em|%)?/g,

            'block-comment' :    /&frasl;\*[\s\S]*?\*&frasl;/gi,
        }
    };
    
    function escapeSpecialChars(text) {
        return text.replace(/"/g, '&quot;').
                    replace(/\//g, '&frasl;').
                    replace(/\</g, '&lt;').
                    replace(/\>/g, '&gt;');
                
    }

    function getObjectType (obj) {
        return Object.prototype.toString.call(obj);
    }

    function highlight(item) {
        var lang = item.getAttribute('lang'),
            theme = item.getAttribute('theme') || options.defalutTheme,
            content = escapeSpecialChars(item.innerText),
            db = database[lang];

        if (typeof db !== 'undefined') {
            for (var type in db) {
                var rule = db[type];

                if (getObjectType(rule) === '[object Array]') {
                    var regexp = '\\b(' + rule.join('|') + ')\\b';
                    rule = new RegExp(regexp, 'g');
                    db[type] = rule;
                }

                content = content.replace(rule, function (str) {
                    return str.replace(/.+/g, '<span class="' + type + '">$&</span>');
                });
            }
        }

        item.outerHTML =    '<div class="humpty' + (!!options.alwaysOpen ? ' always-open' : '') + 
                            (!!options.hideLineNumbers ? ' hide-ln-num' : '') + '"><div class="humpty-caption">Код:'+
                            '<span class="humpty-open-btn" onclick="Humpty.__openHumpty(this);">&dArr;</span></div>'+
                            '<ul class="humpty-code">' +
                            content.replace(/[\s\r\n]*$/g, '').replace(/^(.*)$/gm, '<li>$&</li>') + 
                            '</ul></div>';
    }


    window.Humpty = {
        config : function (paramObj) {
            if (getObjectType(paramObj) !== '[object Object]') {
                return false;
            }

            for (var prop in options) {
                if (paramObj.hasOwnProperty(prop)) {
                    options[prop] = paramObj[prop];
                }
            }
        },

        /* Private methods */
        __openHumpty : function() {
            var el = event.target,
                ed = el.parentNode.parentNode;

            if (el.innerText == '\u21D3') {
                el.innerHTML = '&uArr;';
                ed.classList.add('open');
            } else {
                el.innerHTML = '&dArr;';
                ed.classList.remove('open');
            }
        }
    };

    
    if (options.autorun) {
        var autoRunFunc = function () {
            var codeTags = options.codeTags;

            for (var i = 0; i < codeTags.length; i++) {

                var el = document.getElementsByTagName(codeTags[i]),
                    allTags = Array.prototype.slice.call(el);

                for(var j = 0; j < allTags.length; j++) {
                   highlight(allTags[j]);
                }
            }
        };

        if (typeof window.addEventListener === 'function') {
            window.addEventListener('load', autoRunFunc, false);
        } else {
            window.attachEvent('onload', autoRunFunc);
        }
    }    
})();