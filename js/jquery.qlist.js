/**
 * A jQuery plugin boilerplate.
 * jquery.qlist.js
 * plugin admin@tomytime.com.cn 2013.5.1
 */
//var isIe = $.browser.msie;

; (function($) {
    var pluginName = 'qlist';
 //   var isIe = $.browser.msie;

    function Plugin(element, options) {
        var el = element;
        var $el = $(element);
        options = $.extend({}, $.fn[pluginName].defaults, options);
        var id = $el.attr("id");

        function init() {
        	if(options.data.length > options.maxsize){
                 options.pop = true;
            }
            $el.addClass("pack-up");
            $el.append("<ul id='"+$el.attr('id')+"_ul' class='pack-list'></ul>");
            $el.find('#'+$el.attr('id')+'_ul').append("<li id="+options.title.key+" class='disabled'><a>"+options.title.name+"</a></li>");
            $el.find('#'+$el.attr('id')+'_ul').append("<li class='active'><a href='#'>"+ "\u5168\u90E8"+"</a></li>");
            $el.find('#'+$el.attr('id')+'_ul').append( options.pop ? "<li class='pull-out'><a href='javascript:void(0)'><img  class='btn btn_more' src='images/frame_plus.png' /></a></li>" : "<li class='pull-right'><a href='javascript:void(0)'><img  class='btn btn_arrow_down' src='images/frame_down.png' /></a></li>");
            for(var ii=0; ii<options.data.length; ii++){
                $el.find('#'+$el.attr('id')+'_ul').append("<li><a id="+options.data[ii].key+" href='javascript:void(0)' >"+options.data[ii].title+" <span>"+options.data[ii].amount+"</span></a></li>");
                $el.find('#'+$el.attr('id')+'_ul').find("li:last").data("index", ii+3);
            }

            $el.find("li:gt(0)").not('li:eq(1)').each(function(){
                $(this).find('a').bind('click', function(){
                    var oldItem = $(this).parent().parent().find("li.active");
                    var nowItem = $(this).parent();
                    oldItem.removeClass('active');
                    nowItem.addClass('active');
                    if(nowItem.data('index') == oldItem.data('index'))
                    	return;
                    if(oldItem.data('index')){
                        oldItem.insertAfter($el.find('#'+$el.attr('id')+'_ul li:eq('+oldItem.data('index')+')'));
                    }
                    if(nowItem.data('index')){
                        nowItem.insertAfter($el.find('#'+$el.attr('id')+'_ul li:eq(2)'));
                    }
                    $(this).parent().parent().parent().qlist('getSelectedNodes');
                })
            })

            if(options.pop){
                 if($el.parents('body').find('#mask').length == 0){
                     $el.parents('body').append("<div id='mask' class='close_modal'></div>");
                 }
                 if($el.parents('body').find('#modal_window').length == 0){
                     $el.parents('body').append("<div id='modal_window' class='modal_window'></div>");
                 }
                 $el.css("height", 64);
                 $el.find(".pull-out").click(function() {
                     var $e = $(this).parent();
                     $('#mask').css({
                         'display': 'block',
                         opacity: 0
                     });

                     $('#mask').fadeTo(500, 0.8);
                     $('#mask').height(document.body.availHeight);
                     $('#mask').width(document.body.availWidth);
                     //show the modal window
                     $('#modal_window').html('');
                     $('#modal_window').append('<ul id="'+$e.attr("id")+'_modal'+'" class="pack-list"></ul>');
                     $('#modal_window .pack-list').html($e.html());
                     $('#modal_window .pack-list li:lt(3)').hide();
                    // $('#modal_window .pack-list li.pull-out').hide();
                     $('#modal_window .pack-list li:gt(2)').each(function(index){
                         $(this).data('index', $e.find("li:eq("+(index+3)+")").data("index"));
                     })

                     $('#modal_window .pack-list li a').each(function(){
                         $(this).bind("click", function(){
                             if($(this).parent().hasClass('active')){
                        	     $('.close_modal')[0].click();
                             }
                             var indes = $(this).parent().data('index');
                             var id = $(this).parents('ul').attr("id").replace(/_modal/g, '');
                             $("#"+id).find("li:gt(2)").each(function(){
                                 if($(this).data('index') == indes){
                                     $(this).find('a')[0].click();
                                     $('.close_modal')[0].click();
                                     return false;
                                 }
                             })
                         })
                     })
                     var left = ($(window).width() - $('#modal_window').outerWidth()) / 2;
                     var top = ($(window).height() - $('#modal_window').outerHeight()) / 2;
                     $('#modal_window').css({
                         "top" : top,
                         "left" : left
                     });
                     $('#modal_window').fadeIn("fast");
                 });
                 $(".close_modal").click(function(){
                     $('#mask').fadeOut(500);
                     $('#modal_window').fadeOut(500);
                 });
             }else{
                 $el.find(".pull-right").bind('click', function() {
                     var $e = $(this).parent();
                     if ($e.parent().hasClass("pack-down")) {
                         $e.parent().removeClass("pack-down").animate({
                             height: 32
                         }, 500);
                         var oldSrc = $e.find("img").attr("src");
                         var newSrc = oldSrc.replace(/frame_up/ig, "frame_down");
                         $e.find("img").attr("src", newSrc);
                     }else{
                         var top1 = $e.offset().top;
                         var top2 = $e.find("li:last").offset().top;
                         var newHeight = top2 - top1 + 30;
                         $e.parent().animate({
                             height: newHeight
                         }, 500).addClass("pack-down");
                         var oldSrc = $e.find("img").attr("src");
                         var newSrc = oldSrc.replace(/frame_down/ig, "frame_up");
                         $e.find("img").attr("src", newSrc);
                     }
             });
            }
            hook('onInit');
        }

        // for date
        function dateInit(){
            $el.addClass('pack-up');
            $el.append("<ul id='"+$el.attr('id')+"_ul' class='pack-list'></ul>");
            $el.find('#'+$el.attr('id')+'_ul').append("<li id="+options.title.key+" class='disabled'><a>"+options.title.name+"</a></li>");
            $el.find('#'+$el.attr('id')+'_ul').append("<li class='active'><a href='#'>"+ "\u5168\u90E8"+"</a></li>");
            $el.find('#'+$el.attr('id')+'_ul').append('<li><div id="'+$el.attr('id')+'_daterange"  style="background: #fff; border: 1px solid #ccc"><input id="'+$el.attr('id')+'_queryDate" value="\u70B9\u51FB\u9009\u62E9\u65E5\u671F" size="22" /></div></li>');
            // daterangepicker coming soon
    //        $("#"+$el.attr('id')+"_queryDate").daterangepicker();
            $('#'+$el.attr('id')+'_ul').find('li:eq(1)').bind('click', function(){
                $("#"+$el.attr('id')+"_queryDate").val('\u70B9\u51FB\u9009\u62E9\u65E5\u671F');
            })
        }

    /**
     * Get/set a plugin option.
     * Get usage: $('#el').demoplugin('option', 'key');
     * Set usage: $('#el').demoplugin('option', 'key', value);
     */
        function option(key, val) {
            if (val) {
                options[key] = val;
            } else {
                return options[key];
            }
        }

        //get selected Nodes data
        function _getSelectedNodes(){
            var returnVal = new Array;
            $(".pack-list li.active").each(function(){
                if($(this).parent().parent().attr('id') == 'modal_window'){
                    return true;
                }
                var name = $(this).parent().find("li.disabled").attr("id");
                if($(this).find("input").length > 0){
                    var input = $(this).find('input');
                    if(input && input.val() != '\u70B9\u51FB\u9009\u62E9\u65E5\u671F' && input.val() != ''){
                        var date = input.val();
                        date = date.split(' - ');
                        returnVal.push({"name" : name, "value" : date});
                    }
                }
                if($(this).find('a[href!="#"]').length>0){
                    var value = $(this).find("a[href!='#']").attr("id") || '';
                    returnVal.push({"name": name, "value" : value});
                }
            })
            hook('onClick', returnVal);
        }

    /**
     * Destroy plugin.
     * Usage: $('#el').demoplugin('destroy');
     */
        function destroy() {
            $el.each(function() {
                var el = this;
                var $el = $(this);
                hook('onDestroy');
                // Remove Plugin instance from the element.
                $el.removeData('plugin_' + pluginName);
                var id = $el.attr("id");
                $('#' + id + '_ul').remove();
                $el.removeClass();
          });
        }

    /**
     * Callback hooks.
     */
        function hook(hookName, arg) {
            if (options[hookName] !== undefined && arg !== undefined) {
                options[hookName].apply(el, arg);
            }else if(options[hookName] != undefined){
                options[hookName].call(el);
            }
        }

        // Initialize the plugin instance.
        if(options.date === true){
            dateInit();
        }else{
            init();   
        }
        
        // Expose methods of Plugin we wish to be public.
        return {
            option: option,
            destroy: destroy,
            getSelectedNodes: _getSelectedNodes
        };
    }

  /**
   * Plugin definition.
   */
    $.fn[pluginName] = function(options) {
        if (typeof arguments[0] === 'string') {
            var methodName = arguments[0];
            var args = Array.prototype.slice.call(arguments, 1);
            var returnVal;
            this.each(function() {
                if ($.data(this, 'plugin_' + pluginName) && typeof $.data(this, 'plugin_' + pluginName)[methodName] === 'function') {
                    returnVal = $.data(this, 'plugin_' + pluginName)[methodName].apply(this, args);
                } else {
                    throw new Error('Method ' + methodName + ' does not exist on jQuery.' + pluginName);
                }
            });
            if (returnVal !== undefined) {
                return returnVal;
            } else {
                return this;
            }
        } else if (typeof options === "object" || !options) {
            return this.each(function() {
                if (!$.data(this, 'plugin_' + pluginName)) {
                    $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
                }
            });
        }
    };

    // Default plugin options.
    // Options can be overwritten when initializing plugin, by
    // passing an object literal, or after initialization:
    // $('#el').demoplugin('option', 'key', value);
    $.fn[pluginName].defaults = {
        onInit: function() { },
        onDestroy: function() {},
        onClick: function() { },
        data: [],
        date: false,
        pop: false,
        maxsize: 999
    };

})(jQuery);