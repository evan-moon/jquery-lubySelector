/* ===========================================================
 *
 *  Name:          lubySelector.min.js
 *  Updated:       2016-06-10
 *  Version:       0.1.0
 *  Created by:    DART, Lubycon.co
 *
 *  Copyright (c) 2016 Lubycon.co
 *
 * =========================================================== */

(function($){
	$.fn.lubySelector = function(option){
        var defaults = {
            id: "",
            customClass: "",
            width: 150,
            maxHeight: 250,
            float: "right",
            icon: "fa fa-filter",
            theme: "black",
            optGroup: false,//알파벳 헤더 기능
            searchBar: false,//true시 셀렉박스리스트 맨 위에 서치바 생성
            tooltip: false,
            changeEvent: null
        },
        d = {},
        pac = {
            init: function (option) {
                return d = $.extend({}, defaults, option), this.each(function () {
                    if ($(this).hasClass("selectorKey")) $.error("lubySelector is already exists");
                    else {
                        var $this = $(this), $label, $options,
                        id = $this.data("id") ? $this.data("id") : d.id,
                        width = $this.data("width") ? $this.data("width") : d.width,
                        maxHeight = $this.data("max-height") ? $this.data("max-height") : d.maxHeight,
                        float = $this.data("float") ? $this.data("float") : d.float,
                        theme = $this.data("theme") ? $this.data("theme") : d.theme,
                        optGroup = $this.data("optGroup") ? $this.data("optGroup") : d.optGroup,
                        searchBar = $this.data("searchBar") ? $this.data("searchBar") : d.searchBar,
                        label = $this.val();
                        if ($this.val() === null) {
                            $this.val($this.find("option").first().text());
                            label = $this.val();
                        }

                        var $wrapper = $("<span/>", {
                            "id": d.id,
                            "class": "lubySelector",
                            "optGroup": optGroup,
                            "theme": theme,
                            "onmousedown" : "return false"
                        }).insertAfter($this).append($this).css({"width":d.width,"float":d.float}).addClass(d.customClass)
                        .on("click", pac.boxClick).on("focusin", pac.boxFocus)
                        .on("click", ".ls_option", pac.optionClick)
                        .on("change","select",pac.changeOption),

                        $icon = $("<i/>",{"class": "global_icon " + d.icon}).insertBefore($this),
                        $label = $("<span/>",{"class": "ls_label"}).insertBefore($this).text(label),
                        $arrow = $("<i/>",{"class": "ls_arrow fa fa-caret-down"}).insertBefore($this),
                        $optionWrap = $("<span/>",{"class": "ls_optionWrap"}).insertBefore($this).css({"max-height":d.maxHeight}).hide(),

                        $searchBar = d.searchBar ?
                        $("<span/>", {"class":"ls_search"}).appendTo($optionWrap) : "",
                        $inSearchBar = d.searchBar ?
                        $("<input/>",{"class":"ls_input","type":"text"}).appendTo($searchBar).on("keyup",pac.searchEvent) && $("<i/>",{"class":"fa fa-search"}).appendTo($searchBar) : "";

                        $options = $("<span/>",{"class": "guide ls_option"}).appendTo($optionWrap).hide();
                        $this.find("option").each(function(option,selector){
                            var $this = $(this);
                            pac.dataUpdate(option,d,$this,$options);
                        });
                        $(".guide").remove();
                        pac.optionGroup($this);
                        pac.changeTheme($wrapper);
                    }
                });
            },
            dataUpdate: function(option,d,selector,list) {
                var $this = selector,//options in selectbox
                $selectbox = $this.parent,
                $options = list,
                $optionWrap = $options.parent(),
                optionVal = $this.val(),
                optionName = $this.val().trim(),
                optionText = $this.text(),
                optionTip = d.tooltip ? $this.data("tip") : "",
                optionTitle = $this.text().toLowerCase(),
                selected = $this.is(":selected") ? "selected" : "",
                disabled = $this.is(":disabled") ? " disabled " : "",

                icon = $this.data("icon") ? $this.data("icon") : d.icon;

                $this.is("option") ?
                ($("<span/>", {
                    "class": "ls_option " + disabled + selected,
                    title: optionTitle,
                    html: optionText,
                    "data-value": optionVal,
                    "data-tip" : optionTip
                }).appendTo($optionWrap)) : "";
            },
            boxClick: function(event) {
                event.stopPropagation();
                var $this = $(this),
                $options = $this.find(".ls_optionWrap"),
                $searchBar = $this.find(".ls_input"),
                $selectbox = $this.find("select");

                if($(event.target).is($searchBar)) return false;

                if($this.hasClass("open")){
                    $this.removeClass("open");
                    if(isMobile()) $selectbox.hide().trigger("blur");
                    else $options.fadeOut(300);
                }
                else {
                    $this.addClass("open");
                    if(isMobile()) $selectbox.show().trigger("focus");
                    else $options.fadeIn(300);
                }
                $this.focusin();

                if(!isMobile()) $searchBar.focus();
            },
            boxFocus: function() {
                var $this = $(this),
                $searchBar = $this.find(".ls_input");
                $this.hasClass("disabled") ? pac.boxBlur($this) :
                (pac.boxBlur($(".lubySelector.focused").not($this)),
                    $this.addClass("focused"), $searchBar.addClass("focused"),
                    $("html").on("click.boxBlur", function () {
                        pac.boxBlur($this);
                    })
                );
            },
            boxBlur: function(selector) {
                if ($("body").find(selector).length!==0) {
                    var $this = selector,
                    $searchBar = $this.find(".ls_search"),
                    $optionWrap = $this.find(".ls_optionWrap");
                    $this.hasClass("focused") ?
                    ($this.removeClass("open focused"),$searchBar.removeClass("focused"))&&($optionWrap.fadeOut(300)) : "";
                }
            },
            optionGroup: function(selector){
                if(d.optGroup){
                    var $this = selector.prev(".ls_optionWrap"),
                    $list = $this.find(".ls_option"),
                    $optGroup = "<span class='optGroup'></span>";
                    $list.each(function(){
                        var optionTitle = $(this).attr("data-value").substring(0,1),
                        preTitle = $(this).prev().attr("data-value") === null ? "" :
                        $(this).prev().attr("data-value");
                        if(optionTitle !== preTitle){
                            $(this).before($optGroup).prev(".optGroup").text(optionTitle);
                        }
                        else{ return false; }
                    });
                }
                else{ return false; }

            },
            optionClick: function(selector) {
                var $this = $(this),
                $optionWrap = $this.parent(),
                $selectbox = $this.parent().next("select"),
                $label = $this.parents(".lubySelector").find(".ls_label"),
                $wrap = $optionWrap.parent(),
                selectedText = $this.attr("title"),
                selectedValue = $this.data("value");

                selector.stopPropagation();
                !$this.hasClass("selected")?
                    $this.addClass("selected").siblings().removeClass("selected") &&
					$label.text(selectedValue) &&
					$selectbox.val(selectedValue).trigger("change") &&
					$wrap.removeClass("open") &&
					$optionWrap.fadeOut(300) :
                    "";
            },
            changeOption: function() {
                //////$this = selector
                var $this = $(this),
                value = $this.val(),
                list = $this.prev(".ls_optionWrap").find(".ls_option[data-value='" + value + "']");
                list.trigger("click");
                if (d.changeEvent !== null) d.changeEvent.call($this);
            },
            searchEvent: function(selector) {
                var $this = $(this),
                $textValue = $this.val(),
                $options = $this.parent().siblings(".ls_option"),
                $optgroups = $this.parent().siblings(".optGroup"),
                $filter = $this.parent().siblings(".ls_option[title*='"+$textValue+"']"),
                $test = $textValue!=="" ? ($options.hide() && $filter.show() && $optgroups.hide()) : ($options.show() && $optgroups.show());
            },
            changeTheme: function(selector){
                var $this = selector,
                $list = $this.find(".ls_optionWrap"),
                $listInner = $list.find(".ls_option"),
                $arrow = $this.find(".ls_arrow"),
                $icon = $this.find(".global_icon"),
                $searchBar = $this.find(".ls_search"),
                $input = $searchBar.find(".ls_input"),
                $searchIcon = $searchBar.find("i");
                switch($this.attr("theme")){
                    case "black" : return false;
                    case "white" : $this.addClass("white"); break;
                    case "ghost" : $this.addClass("ghost"); break;
                    case "transparent" : $this.addClass("transparent"); break;
                    case "rect" :
                        $this.addClass("rect");
                        $this.css({
                            "min-height" : $this.parent().height(),
                            "line-height" : $this.parent().height() + "px"
                        });
                        $icon.css({ "line-height" : $this.parent().height() - 2 + "px", "left" : "18px" });
                        $arrow.css({ "line-height" : $this.parent().height() - 7 + "px", "right" : "20px" });

                    break;
                    default: return false;
                }

            }
        },
        method = {
            destroy: function(){
                return this.each(function(){
                    var $this = $(this);
                    $this.remove();
                });
            },
            disable: function(){
                return this.each(function(){
                    var $this = $(this);
                    $this.addClass("disabled").off("click").off("focusin").off("change");
                });
            },
            enable: function(){
                return this.each(function(){
                    var $this = $(this);
                    $this.removeClass("disabled")
                    .on("click", pac.boxClick).on("focusin", pac.boxFocus)
                    .on("click", ".ls_option", pac.optionClick)
                    .on("change","select",pac.changeOption);
                });
            },
			getValue: function(){
				return $(this).val();
			},
			getValueByIndex: function(){
				var v = $(this).find("option:selected").index();
				return v === -1 ? null : v;
			},
			setValue: function (value){
                return this.each(function () {
                    var $this = $(this),
                        wrapper = $this.parents('.lubySelector');
                    var options = wrapper.find(".ls_option");
                    options.removeClass("selected");
                    options.each(function(){ if(value === $(this).text()) $(this).addClass("selected"); });

                    $this.val(value);
                    wrapper.find('.ls_label').text(value);
                });
            },
            setValueByIndex: function(index){
                return this.each(function(){
                    var $this = $(this),
                        wrapper = $this.parents('.lubySelector');
                    var target = $(wrapper.find(".ls_option")[index]),
                        options = wrapper.find(".ls_option");

                    options.removeClass("selected");
                    target.addClass("selected");
                    $this.val(target.text());
					console.log($this.val(),target.text());

                    wrapper.find('.ls_label').text(target.text());
                });
            }
        };
        return method[option] ?
        method[option].apply(this, Array.prototype.slice.call(arguments, 1)) :
        "object" != typeof option && option ?
            ($.error('No such method "' + option + '" for the lubySelector instance'), void 0) :
            pac.init.apply(this, arguments);
    };
})(jQuery);
