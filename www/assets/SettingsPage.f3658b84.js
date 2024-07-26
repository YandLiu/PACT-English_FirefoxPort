import { u as useFieldProps, a as useFieldEmits, b as useField, c as useFieldState, d as useAnchorProps, v as validatePosition, e as validateOffset, f as useScrollTarget, g as useAnchor, r as removeClickOutside, s as setPosition, p as parsePosition, h as addClickOutside, i as useFormProps, j as useFormInputNameAttr, k as fieldValueIsFilled, l as useKeyComposition, m as useFormInject, Q as QInput } from "./QInput.da73b6a6.js";
import { l as createComponent, m as computed, n as h, p as hSlot, r as ref, E as watch, O as position, ag as Transition, x as onBeforeUnmount, A as getCurrentInstance, ap as childHasFocus, R as stopAndPrevent, y as noop, S as debounce, o as onBeforeMount, T as onDeactivated, U as onActivated, z as nextTick, aq as onBeforeUpdate, ar as onUpdated, M as prevent, a4 as QIcon, as as isDeepEqual, a8 as isKeyCode, N as stop, at as shouldIgnoreKey, V as hMergeSlot, an as useSize, am as useSizeProps, al as toRaw, X as provide, s as onMounted, ae as vmIsDestroyed, au as formKey, a0 as _export_sfc, d as defineComponent, h as openBlock, c as createElementBlock, a2 as createBlock, f as withCtx, a as createBaseVNode, k as createCommentVNode, e as createVNode, u as unref, av as normalizeClass, t as toDisplayString, w as withDirectives, v as vShow, Q as QBtn, ai as pushScopeId, aj as popScopeId } from "./index.454a89f7.js";
import { Q as QChip } from "./QChip.02824bab.js";
import { n as normalizeToInterval, a as QItemSection, Q as QItem } from "./format.d617f384.js";
import { u as useModelToggleProps, d as useModelToggleEmits, e as useTimeout, f as useModelToggle, g as getScrollTarget } from "./use-timeout.a3e918be.js";
import { u as useDarkProps, a as useDark } from "./use-dark.a20bd128.js";
import { u as useTransitionProps, a as useTick, b as useTransition, c as usePortal, d as addFocusout, r as removeFocusout, e as removeEscapeKey, f as addFocusFn, g as closePortalMenus, h as addEscapeKey, Q as QDialog, i as useQuasar } from "./use-quasar.2220b5e4.js";
import { L as LanguageManager, d as getConfig, i as updateConfig, j as initConfig } from "./axios.ead55ef2.js";
import "./selection.231d774a.js";
var QField = createComponent({
  name: "QField",
  inheritAttrs: false,
  props: useFieldProps,
  emits: useFieldEmits,
  setup() {
    return useField(useFieldState());
  }
});
var QItemLabel = createComponent({
  name: "QItemLabel",
  props: {
    overline: Boolean,
    caption: Boolean,
    header: Boolean,
    lines: [Number, String]
  },
  setup(props, { slots }) {
    const parsedLines = computed(() => parseInt(props.lines, 10));
    const classes = computed(
      () => "q-item__label" + (props.overline === true ? " q-item__label--overline text-overline" : "") + (props.caption === true ? " q-item__label--caption text-caption" : "") + (props.header === true ? " q-item__label--header" : "") + (parsedLines.value === 1 ? " ellipsis" : "")
    );
    const style = computed(() => {
      return props.lines !== void 0 && parsedLines.value > 1 ? {
        overflow: "hidden",
        display: "-webkit-box",
        "-webkit-box-orient": "vertical",
        "-webkit-line-clamp": parsedLines.value
      } : null;
    });
    return () => h("div", {
      style: style.value,
      class: classes.value
    }, hSlot(slots.default));
  }
});
var QMenu = createComponent({
  name: "QMenu",
  inheritAttrs: false,
  props: {
    ...useAnchorProps,
    ...useModelToggleProps,
    ...useDarkProps,
    ...useTransitionProps,
    persistent: Boolean,
    autoClose: Boolean,
    separateClosePopup: Boolean,
    noRouteDismiss: Boolean,
    noRefocus: Boolean,
    noFocus: Boolean,
    fit: Boolean,
    cover: Boolean,
    square: Boolean,
    anchor: {
      type: String,
      validator: validatePosition
    },
    self: {
      type: String,
      validator: validatePosition
    },
    offset: {
      type: Array,
      validator: validateOffset
    },
    scrollTarget: {
      default: void 0
    },
    touchPosition: Boolean,
    maxHeight: {
      type: String,
      default: null
    },
    maxWidth: {
      type: String,
      default: null
    }
  },
  emits: [
    ...useModelToggleEmits,
    "click",
    "escapeKey"
  ],
  setup(props, { slots, emit, attrs }) {
    let refocusTarget = null, absoluteOffset, unwatchPosition, avoidAutoClose;
    const vm = getCurrentInstance();
    const { proxy } = vm;
    const { $q } = proxy;
    const innerRef = ref(null);
    const showing = ref(false);
    const hideOnRouteChange = computed(
      () => props.persistent !== true && props.noRouteDismiss !== true
    );
    const isDark = useDark(props, $q);
    const { registerTick, removeTick } = useTick();
    const { registerTimeout } = useTimeout();
    const { transitionProps, transitionStyle } = useTransition(props);
    const { localScrollTarget, changeScrollEvent, unconfigureScrollTarget } = useScrollTarget(props, configureScrollTarget);
    const { anchorEl, canShow } = useAnchor({ showing });
    const { hide } = useModelToggle({
      showing,
      canShow,
      handleShow,
      handleHide,
      hideOnRouteChange,
      processOnMount: true
    });
    const { showPortal, hidePortal, renderPortal } = usePortal(vm, innerRef, renderPortalContent, "menu");
    const clickOutsideProps = {
      anchorEl,
      innerRef,
      onClickOutside(e) {
        if (props.persistent !== true && showing.value === true) {
          hide(e);
          if (e.type === "touchstart" || e.target.classList.contains("q-dialog__backdrop")) {
            stopAndPrevent(e);
          }
          return true;
        }
      }
    };
    const anchorOrigin = computed(
      () => parsePosition(
        props.anchor || (props.cover === true ? "center middle" : "bottom start"),
        $q.lang.rtl
      )
    );
    const selfOrigin = computed(() => props.cover === true ? anchorOrigin.value : parsePosition(props.self || "top start", $q.lang.rtl));
    const menuClass = computed(
      () => (props.square === true ? " q-menu--square" : "") + (isDark.value === true ? " q-menu--dark q-dark" : "")
    );
    const onEvents = computed(() => props.autoClose === true ? { onClick: onAutoClose } : {});
    const handlesFocus = computed(
      () => showing.value === true && props.persistent !== true
    );
    watch(handlesFocus, (val) => {
      if (val === true) {
        addEscapeKey(onEscapeKey);
        addClickOutside(clickOutsideProps);
      } else {
        removeEscapeKey(onEscapeKey);
        removeClickOutside(clickOutsideProps);
      }
    });
    function focus() {
      addFocusFn(() => {
        let node = innerRef.value;
        if (node && node.contains(document.activeElement) !== true) {
          node = node.querySelector("[autofocus][tabindex], [data-autofocus][tabindex]") || node.querySelector("[autofocus] [tabindex], [data-autofocus] [tabindex]") || node.querySelector("[autofocus], [data-autofocus]") || node;
          node.focus({ preventScroll: true });
        }
      });
    }
    function handleShow(evt) {
      refocusTarget = props.noRefocus === false ? document.activeElement : null;
      addFocusout(onFocusout);
      showPortal();
      configureScrollTarget();
      absoluteOffset = void 0;
      if (evt !== void 0 && (props.touchPosition || props.contextMenu)) {
        const pos = position(evt);
        if (pos.left !== void 0) {
          const { top, left } = anchorEl.value.getBoundingClientRect();
          absoluteOffset = { left: pos.left - left, top: pos.top - top };
        }
      }
      if (unwatchPosition === void 0) {
        unwatchPosition = watch(
          () => $q.screen.width + "|" + $q.screen.height + "|" + props.self + "|" + props.anchor + "|" + $q.lang.rtl,
          updatePosition
        );
      }
      if (props.noFocus !== true) {
        document.activeElement.blur();
      }
      registerTick(() => {
        updatePosition();
        props.noFocus !== true && focus();
      });
      registerTimeout(() => {
        if ($q.platform.is.ios === true) {
          avoidAutoClose = props.autoClose;
          innerRef.value.click();
        }
        updatePosition();
        showPortal(true);
        emit("show", evt);
      }, props.transitionDuration);
    }
    function handleHide(evt) {
      removeTick();
      hidePortal();
      anchorCleanup(true);
      if (refocusTarget !== null && (evt === void 0 || evt.qClickOutside !== true)) {
        ((evt && evt.type.indexOf("key") === 0 ? refocusTarget.closest('[tabindex]:not([tabindex^="-"])') : void 0) || refocusTarget).focus();
        refocusTarget = null;
      }
      registerTimeout(() => {
        hidePortal(true);
        emit("hide", evt);
      }, props.transitionDuration);
    }
    function anchorCleanup(hiding) {
      absoluteOffset = void 0;
      if (unwatchPosition !== void 0) {
        unwatchPosition();
        unwatchPosition = void 0;
      }
      if (hiding === true || showing.value === true) {
        removeFocusout(onFocusout);
        unconfigureScrollTarget();
        removeClickOutside(clickOutsideProps);
        removeEscapeKey(onEscapeKey);
      }
      if (hiding !== true) {
        refocusTarget = null;
      }
    }
    function configureScrollTarget() {
      if (anchorEl.value !== null || props.scrollTarget !== void 0) {
        localScrollTarget.value = getScrollTarget(anchorEl.value, props.scrollTarget);
        changeScrollEvent(localScrollTarget.value, updatePosition);
      }
    }
    function onAutoClose(e) {
      if (avoidAutoClose !== true) {
        closePortalMenus(proxy, e);
        emit("click", e);
      } else {
        avoidAutoClose = false;
      }
    }
    function onFocusout(evt) {
      if (handlesFocus.value === true && props.noFocus !== true && childHasFocus(innerRef.value, evt.target) !== true) {
        focus();
      }
    }
    function onEscapeKey(evt) {
      emit("escapeKey");
      hide(evt);
    }
    function updatePosition() {
      setPosition({
        targetEl: innerRef.value,
        offset: props.offset,
        anchorEl: anchorEl.value,
        anchorOrigin: anchorOrigin.value,
        selfOrigin: selfOrigin.value,
        absoluteOffset,
        fit: props.fit,
        cover: props.cover,
        maxHeight: props.maxHeight,
        maxWidth: props.maxWidth
      });
    }
    function renderPortalContent() {
      return h(
        Transition,
        transitionProps.value,
        () => showing.value === true ? h("div", {
          role: "menu",
          ...attrs,
          ref: innerRef,
          tabindex: -1,
          class: [
            "q-menu q-position-engine scroll" + menuClass.value,
            attrs.class
          ],
          style: [
            attrs.style,
            transitionStyle.value
          ],
          ...onEvents.value
        }, hSlot(slots.default)) : null
      );
    }
    onBeforeUnmount(anchorCleanup);
    Object.assign(proxy, { focus, updatePosition });
    return renderPortal;
  }
});
let rtlHasScrollBug = false;
{
  const scroller = document.createElement("div");
  scroller.setAttribute("dir", "rtl");
  Object.assign(scroller.style, {
    width: "1px",
    height: "1px",
    overflow: "auto"
  });
  const spacer = document.createElement("div");
  Object.assign(spacer.style, {
    width: "1000px",
    height: "1px"
  });
  document.body.appendChild(scroller);
  scroller.appendChild(spacer);
  scroller.scrollLeft = -1e3;
  rtlHasScrollBug = scroller.scrollLeft >= 0;
  scroller.remove();
}
const aggBucketSize = 1e3;
const scrollToEdges = [
  "start",
  "center",
  "end",
  "start-force",
  "center-force",
  "end-force"
];
const filterProto = Array.prototype.filter;
const setOverflowAnchor = window.getComputedStyle(document.body).overflowAnchor === void 0 ? noop : function(contentEl, index) {
  if (contentEl === null) {
    return;
  }
  if (contentEl._qOverflowAnimationFrame !== void 0) {
    cancelAnimationFrame(contentEl._qOverflowAnimationFrame);
  }
  contentEl._qOverflowAnimationFrame = requestAnimationFrame(() => {
    if (contentEl === null) {
      return;
    }
    contentEl._qOverflowAnimationFrame = void 0;
    const children = contentEl.children || [];
    filterProto.call(children, (el2) => el2.dataset && el2.dataset.qVsAnchor !== void 0).forEach((el2) => {
      delete el2.dataset.qVsAnchor;
    });
    const el = children[index];
    if (el && el.dataset) {
      el.dataset.qVsAnchor = "";
    }
  });
};
function sumFn(acc, h2) {
  return acc + h2;
}
function getScrollDetails(parent, child, beforeRef, afterRef, horizontal, rtl, stickyStart, stickyEnd) {
  const parentCalc = parent === window ? document.scrollingElement || document.documentElement : parent, propElSize = horizontal === true ? "offsetWidth" : "offsetHeight", details = {
    scrollStart: 0,
    scrollViewSize: -stickyStart - stickyEnd,
    scrollMaxSize: 0,
    offsetStart: -stickyStart,
    offsetEnd: -stickyEnd
  };
  if (horizontal === true) {
    if (parent === window) {
      details.scrollStart = window.pageXOffset || window.scrollX || document.body.scrollLeft || 0;
      details.scrollViewSize += document.documentElement.clientWidth;
    } else {
      details.scrollStart = parentCalc.scrollLeft;
      details.scrollViewSize += parentCalc.clientWidth;
    }
    details.scrollMaxSize = parentCalc.scrollWidth;
    if (rtl === true) {
      details.scrollStart = (rtlHasScrollBug === true ? details.scrollMaxSize - details.scrollViewSize : 0) - details.scrollStart;
    }
  } else {
    if (parent === window) {
      details.scrollStart = window.pageYOffset || window.scrollY || document.body.scrollTop || 0;
      details.scrollViewSize += document.documentElement.clientHeight;
    } else {
      details.scrollStart = parentCalc.scrollTop;
      details.scrollViewSize += parentCalc.clientHeight;
    }
    details.scrollMaxSize = parentCalc.scrollHeight;
  }
  if (beforeRef !== null) {
    for (let el = beforeRef.previousElementSibling; el !== null; el = el.previousElementSibling) {
      if (el.classList.contains("q-virtual-scroll--skip") === false) {
        details.offsetStart += el[propElSize];
      }
    }
  }
  if (afterRef !== null) {
    for (let el = afterRef.nextElementSibling; el !== null; el = el.nextElementSibling) {
      if (el.classList.contains("q-virtual-scroll--skip") === false) {
        details.offsetEnd += el[propElSize];
      }
    }
  }
  if (child !== parent) {
    const parentRect = parentCalc.getBoundingClientRect(), childRect = child.getBoundingClientRect();
    if (horizontal === true) {
      details.offsetStart += childRect.left - parentRect.left;
      details.offsetEnd -= childRect.width;
    } else {
      details.offsetStart += childRect.top - parentRect.top;
      details.offsetEnd -= childRect.height;
    }
    if (parent !== window) {
      details.offsetStart += details.scrollStart;
    }
    details.offsetEnd += details.scrollMaxSize - details.offsetStart;
  }
  return details;
}
function setScroll(parent, scroll, horizontal, rtl) {
  if (scroll === "end") {
    scroll = (parent === window ? document.body : parent)[horizontal === true ? "scrollWidth" : "scrollHeight"];
  }
  if (parent === window) {
    if (horizontal === true) {
      if (rtl === true) {
        scroll = (rtlHasScrollBug === true ? document.body.scrollWidth - document.documentElement.clientWidth : 0) - scroll;
      }
      window.scrollTo(scroll, window.pageYOffset || window.scrollY || document.body.scrollTop || 0);
    } else {
      window.scrollTo(window.pageXOffset || window.scrollX || document.body.scrollLeft || 0, scroll);
    }
  } else if (horizontal === true) {
    if (rtl === true) {
      scroll = (rtlHasScrollBug === true ? parent.scrollWidth - parent.offsetWidth : 0) - scroll;
    }
    parent.scrollLeft = scroll;
  } else {
    parent.scrollTop = scroll;
  }
}
function sumSize(sizeAgg, size, from, to) {
  if (from >= to) {
    return 0;
  }
  const lastTo = size.length, fromAgg = Math.floor(from / aggBucketSize), toAgg = Math.floor((to - 1) / aggBucketSize) + 1;
  let total = sizeAgg.slice(fromAgg, toAgg).reduce(sumFn, 0);
  if (from % aggBucketSize !== 0) {
    total -= size.slice(fromAgg * aggBucketSize, from).reduce(sumFn, 0);
  }
  if (to % aggBucketSize !== 0 && to !== lastTo) {
    total -= size.slice(to, toAgg * aggBucketSize).reduce(sumFn, 0);
  }
  return total;
}
const commonVirtScrollProps = {
  virtualScrollSliceSize: {
    type: [Number, String],
    default: null
  },
  virtualScrollSliceRatioBefore: {
    type: [Number, String],
    default: 1
  },
  virtualScrollSliceRatioAfter: {
    type: [Number, String],
    default: 1
  },
  virtualScrollItemSize: {
    type: [Number, String],
    default: 24
  },
  virtualScrollStickySizeStart: {
    type: [Number, String],
    default: 0
  },
  virtualScrollStickySizeEnd: {
    type: [Number, String],
    default: 0
  },
  tableColspan: [Number, String]
};
const useVirtualScrollProps = {
  virtualScrollHorizontal: Boolean,
  onVirtualScroll: Function,
  ...commonVirtScrollProps
};
function useVirtualScroll({
  virtualScrollLength,
  getVirtualScrollTarget,
  getVirtualScrollEl,
  virtualScrollItemSizeComputed
}) {
  const vm = getCurrentInstance();
  const { props, emit, proxy } = vm;
  const { $q } = proxy;
  let prevScrollStart, prevToIndex, localScrollViewSize, virtualScrollSizesAgg = [], virtualScrollSizes;
  const virtualScrollPaddingBefore = ref(0);
  const virtualScrollPaddingAfter = ref(0);
  const virtualScrollSliceSizeComputed = ref({});
  const beforeRef = ref(null);
  const afterRef = ref(null);
  const contentRef = ref(null);
  const virtualScrollSliceRange = ref({ from: 0, to: 0 });
  const colspanAttr = computed(() => props.tableColspan !== void 0 ? props.tableColspan : 100);
  if (virtualScrollItemSizeComputed === void 0) {
    virtualScrollItemSizeComputed = computed(() => props.virtualScrollItemSize);
  }
  const needsReset = computed(() => virtualScrollItemSizeComputed.value + ";" + props.virtualScrollHorizontal);
  const needsSliceRecalc = computed(
    () => needsReset.value + ";" + props.virtualScrollSliceRatioBefore + ";" + props.virtualScrollSliceRatioAfter
  );
  watch(needsSliceRecalc, () => {
    setVirtualScrollSize();
  });
  watch(needsReset, reset);
  function reset() {
    localResetVirtualScroll(prevToIndex, true);
  }
  function refresh(toIndex) {
    localResetVirtualScroll(toIndex === void 0 ? prevToIndex : toIndex);
  }
  function scrollTo(toIndex, edge) {
    const scrollEl = getVirtualScrollTarget();
    if (scrollEl === void 0 || scrollEl === null || scrollEl.nodeType === 8) {
      return;
    }
    const scrollDetails = getScrollDetails(
      scrollEl,
      getVirtualScrollEl(),
      beforeRef.value,
      afterRef.value,
      props.virtualScrollHorizontal,
      $q.lang.rtl,
      props.virtualScrollStickySizeStart,
      props.virtualScrollStickySizeEnd
    );
    localScrollViewSize !== scrollDetails.scrollViewSize && setVirtualScrollSize(scrollDetails.scrollViewSize);
    setVirtualScrollSliceRange(
      scrollEl,
      scrollDetails,
      Math.min(virtualScrollLength.value - 1, Math.max(0, parseInt(toIndex, 10) || 0)),
      0,
      scrollToEdges.indexOf(edge) > -1 ? edge : prevToIndex > -1 && toIndex > prevToIndex ? "end" : "start"
    );
  }
  function localOnVirtualScrollEvt() {
    const scrollEl = getVirtualScrollTarget();
    if (scrollEl === void 0 || scrollEl === null || scrollEl.nodeType === 8) {
      return;
    }
    const scrollDetails = getScrollDetails(
      scrollEl,
      getVirtualScrollEl(),
      beforeRef.value,
      afterRef.value,
      props.virtualScrollHorizontal,
      $q.lang.rtl,
      props.virtualScrollStickySizeStart,
      props.virtualScrollStickySizeEnd
    ), listLastIndex = virtualScrollLength.value - 1, listEndOffset = scrollDetails.scrollMaxSize - scrollDetails.offsetStart - scrollDetails.offsetEnd - virtualScrollPaddingAfter.value;
    if (prevScrollStart === scrollDetails.scrollStart) {
      return;
    }
    if (scrollDetails.scrollMaxSize <= 0) {
      setVirtualScrollSliceRange(scrollEl, scrollDetails, 0, 0);
      return;
    }
    localScrollViewSize !== scrollDetails.scrollViewSize && setVirtualScrollSize(scrollDetails.scrollViewSize);
    updateVirtualScrollSizes(virtualScrollSliceRange.value.from);
    const scrollMaxStart = Math.floor(scrollDetails.scrollMaxSize - Math.max(scrollDetails.scrollViewSize, scrollDetails.offsetEnd) - Math.min(virtualScrollSizes[listLastIndex], scrollDetails.scrollViewSize / 2));
    if (scrollMaxStart > 0 && Math.ceil(scrollDetails.scrollStart) >= scrollMaxStart) {
      setVirtualScrollSliceRange(
        scrollEl,
        scrollDetails,
        listLastIndex,
        scrollDetails.scrollMaxSize - scrollDetails.offsetEnd - virtualScrollSizesAgg.reduce(sumFn, 0)
      );
      return;
    }
    let toIndex = 0, listOffset = scrollDetails.scrollStart - scrollDetails.offsetStart, offset = listOffset;
    if (listOffset <= listEndOffset && listOffset + scrollDetails.scrollViewSize >= virtualScrollPaddingBefore.value) {
      listOffset -= virtualScrollPaddingBefore.value;
      toIndex = virtualScrollSliceRange.value.from;
      offset = listOffset;
    } else {
      for (let j = 0; listOffset >= virtualScrollSizesAgg[j] && toIndex < listLastIndex; j++) {
        listOffset -= virtualScrollSizesAgg[j];
        toIndex += aggBucketSize;
      }
    }
    while (listOffset > 0 && toIndex < listLastIndex) {
      listOffset -= virtualScrollSizes[toIndex];
      if (listOffset > -scrollDetails.scrollViewSize) {
        toIndex++;
        offset = listOffset;
      } else {
        offset = virtualScrollSizes[toIndex] + listOffset;
      }
    }
    setVirtualScrollSliceRange(
      scrollEl,
      scrollDetails,
      toIndex,
      offset
    );
  }
  function setVirtualScrollSliceRange(scrollEl, scrollDetails, toIndex, offset, align) {
    const alignForce = typeof align === "string" && align.indexOf("-force") > -1;
    const alignEnd = alignForce === true ? align.replace("-force", "") : align;
    const alignRange = alignEnd !== void 0 ? alignEnd : "start";
    let from = Math.max(0, toIndex - virtualScrollSliceSizeComputed.value[alignRange]), to = from + virtualScrollSliceSizeComputed.value.total;
    if (to > virtualScrollLength.value) {
      to = virtualScrollLength.value;
      from = Math.max(0, to - virtualScrollSliceSizeComputed.value.total);
    }
    prevScrollStart = scrollDetails.scrollStart;
    const rangeChanged = from !== virtualScrollSliceRange.value.from || to !== virtualScrollSliceRange.value.to;
    if (rangeChanged === false && alignEnd === void 0) {
      emitScroll(toIndex);
      return;
    }
    const { activeElement } = document;
    const contentEl = contentRef.value;
    if (rangeChanged === true && contentEl !== null && contentEl !== activeElement && contentEl.contains(activeElement) === true) {
      contentEl.addEventListener("focusout", onBlurRefocusFn);
      setTimeout(() => {
        contentEl !== null && contentEl.removeEventListener("focusout", onBlurRefocusFn);
      });
    }
    setOverflowAnchor(contentEl, toIndex - from);
    const sizeBefore = alignEnd !== void 0 ? virtualScrollSizes.slice(from, toIndex).reduce(sumFn, 0) : 0;
    if (rangeChanged === true) {
      const tempTo = to >= virtualScrollSliceRange.value.from && from <= virtualScrollSliceRange.value.to ? virtualScrollSliceRange.value.to : to;
      virtualScrollSliceRange.value = { from, to: tempTo };
      virtualScrollPaddingBefore.value = sumSize(virtualScrollSizesAgg, virtualScrollSizes, 0, from);
      virtualScrollPaddingAfter.value = sumSize(virtualScrollSizesAgg, virtualScrollSizes, to, virtualScrollLength.value);
      requestAnimationFrame(() => {
        if (virtualScrollSliceRange.value.to !== to && prevScrollStart === scrollDetails.scrollStart) {
          virtualScrollSliceRange.value = { from: virtualScrollSliceRange.value.from, to };
          virtualScrollPaddingAfter.value = sumSize(virtualScrollSizesAgg, virtualScrollSizes, to, virtualScrollLength.value);
        }
      });
    }
    requestAnimationFrame(() => {
      if (prevScrollStart !== scrollDetails.scrollStart) {
        return;
      }
      if (rangeChanged === true) {
        updateVirtualScrollSizes(from);
      }
      const sizeAfter = virtualScrollSizes.slice(from, toIndex).reduce(sumFn, 0), posStart = sizeAfter + scrollDetails.offsetStart + virtualScrollPaddingBefore.value, posEnd = posStart + virtualScrollSizes[toIndex];
      let scrollPosition = posStart + offset;
      if (alignEnd !== void 0) {
        const sizeDiff = sizeAfter - sizeBefore;
        const scrollStart = scrollDetails.scrollStart + sizeDiff;
        scrollPosition = alignForce !== true && scrollStart < posStart && posEnd < scrollStart + scrollDetails.scrollViewSize ? scrollStart : alignEnd === "end" ? posEnd - scrollDetails.scrollViewSize : posStart - (alignEnd === "start" ? 0 : Math.round((scrollDetails.scrollViewSize - virtualScrollSizes[toIndex]) / 2));
      }
      prevScrollStart = scrollPosition;
      setScroll(
        scrollEl,
        scrollPosition,
        props.virtualScrollHorizontal,
        $q.lang.rtl
      );
      emitScroll(toIndex);
    });
  }
  function updateVirtualScrollSizes(from) {
    const contentEl = contentRef.value;
    if (contentEl) {
      const children = filterProto.call(
        contentEl.children,
        (el) => el.classList && el.classList.contains("q-virtual-scroll--skip") === false
      ), childrenLength = children.length, sizeFn = props.virtualScrollHorizontal === true ? (el) => el.getBoundingClientRect().width : (el) => el.offsetHeight;
      let index = from, size, diff;
      for (let i = 0; i < childrenLength; ) {
        size = sizeFn(children[i]);
        i++;
        while (i < childrenLength && children[i].classList.contains("q-virtual-scroll--with-prev") === true) {
          size += sizeFn(children[i]);
          i++;
        }
        diff = size - virtualScrollSizes[index];
        if (diff !== 0) {
          virtualScrollSizes[index] += diff;
          virtualScrollSizesAgg[Math.floor(index / aggBucketSize)] += diff;
        }
        index++;
      }
    }
  }
  function onBlurRefocusFn() {
    contentRef.value !== null && contentRef.value !== void 0 && contentRef.value.focus();
  }
  function localResetVirtualScroll(toIndex, fullReset) {
    const defaultSize = 1 * virtualScrollItemSizeComputed.value;
    if (fullReset === true || Array.isArray(virtualScrollSizes) === false) {
      virtualScrollSizes = [];
    }
    const oldVirtualScrollSizesLength = virtualScrollSizes.length;
    virtualScrollSizes.length = virtualScrollLength.value;
    for (let i = virtualScrollLength.value - 1; i >= oldVirtualScrollSizesLength; i--) {
      virtualScrollSizes[i] = defaultSize;
    }
    const jMax = Math.floor((virtualScrollLength.value - 1) / aggBucketSize);
    virtualScrollSizesAgg = [];
    for (let j = 0; j <= jMax; j++) {
      let size = 0;
      const iMax = Math.min((j + 1) * aggBucketSize, virtualScrollLength.value);
      for (let i = j * aggBucketSize; i < iMax; i++) {
        size += virtualScrollSizes[i];
      }
      virtualScrollSizesAgg.push(size);
    }
    prevToIndex = -1;
    prevScrollStart = void 0;
    virtualScrollPaddingBefore.value = sumSize(virtualScrollSizesAgg, virtualScrollSizes, 0, virtualScrollSliceRange.value.from);
    virtualScrollPaddingAfter.value = sumSize(virtualScrollSizesAgg, virtualScrollSizes, virtualScrollSliceRange.value.to, virtualScrollLength.value);
    if (toIndex >= 0) {
      updateVirtualScrollSizes(virtualScrollSliceRange.value.from);
      nextTick(() => {
        scrollTo(toIndex);
      });
    } else {
      onVirtualScrollEvt();
    }
  }
  function setVirtualScrollSize(scrollViewSize) {
    if (scrollViewSize === void 0 && typeof window !== "undefined") {
      const scrollEl = getVirtualScrollTarget();
      if (scrollEl !== void 0 && scrollEl !== null && scrollEl.nodeType !== 8) {
        scrollViewSize = getScrollDetails(
          scrollEl,
          getVirtualScrollEl(),
          beforeRef.value,
          afterRef.value,
          props.virtualScrollHorizontal,
          $q.lang.rtl,
          props.virtualScrollStickySizeStart,
          props.virtualScrollStickySizeEnd
        ).scrollViewSize;
      }
    }
    localScrollViewSize = scrollViewSize;
    const virtualScrollSliceRatioBefore = parseFloat(props.virtualScrollSliceRatioBefore) || 0;
    const virtualScrollSliceRatioAfter = parseFloat(props.virtualScrollSliceRatioAfter) || 0;
    const multiplier = 1 + virtualScrollSliceRatioBefore + virtualScrollSliceRatioAfter;
    const view = scrollViewSize === void 0 || scrollViewSize <= 0 ? 1 : Math.ceil(scrollViewSize / virtualScrollItemSizeComputed.value);
    const baseSize = Math.max(
      1,
      view,
      Math.ceil((props.virtualScrollSliceSize > 0 ? props.virtualScrollSliceSize : 10) / multiplier)
    );
    virtualScrollSliceSizeComputed.value = {
      total: Math.ceil(baseSize * multiplier),
      start: Math.ceil(baseSize * virtualScrollSliceRatioBefore),
      center: Math.ceil(baseSize * (0.5 + virtualScrollSliceRatioBefore)),
      end: Math.ceil(baseSize * (1 + virtualScrollSliceRatioBefore)),
      view
    };
  }
  function padVirtualScroll(tag, content) {
    const paddingSize = props.virtualScrollHorizontal === true ? "width" : "height";
    const style = {
      ["--q-virtual-scroll-item-" + paddingSize]: virtualScrollItemSizeComputed.value + "px"
    };
    return [
      tag === "tbody" ? h(tag, {
        class: "q-virtual-scroll__padding",
        key: "before",
        ref: beforeRef
      }, [
        h("tr", [
          h("td", {
            style: { [paddingSize]: `${virtualScrollPaddingBefore.value}px`, ...style },
            colspan: colspanAttr.value
          })
        ])
      ]) : h(tag, {
        class: "q-virtual-scroll__padding",
        key: "before",
        ref: beforeRef,
        style: { [paddingSize]: `${virtualScrollPaddingBefore.value}px`, ...style }
      }),
      h(tag, {
        class: "q-virtual-scroll__content",
        key: "content",
        ref: contentRef,
        tabindex: -1
      }, content.flat()),
      tag === "tbody" ? h(tag, {
        class: "q-virtual-scroll__padding",
        key: "after",
        ref: afterRef
      }, [
        h("tr", [
          h("td", {
            style: { [paddingSize]: `${virtualScrollPaddingAfter.value}px`, ...style },
            colspan: colspanAttr.value
          })
        ])
      ]) : h(tag, {
        class: "q-virtual-scroll__padding",
        key: "after",
        ref: afterRef,
        style: { [paddingSize]: `${virtualScrollPaddingAfter.value}px`, ...style }
      })
    ];
  }
  function emitScroll(index) {
    if (prevToIndex !== index) {
      props.onVirtualScroll !== void 0 && emit("virtualScroll", {
        index,
        from: virtualScrollSliceRange.value.from,
        to: virtualScrollSliceRange.value.to - 1,
        direction: index < prevToIndex ? "decrease" : "increase",
        ref: proxy
      });
      prevToIndex = index;
    }
  }
  setVirtualScrollSize();
  const onVirtualScrollEvt = debounce(
    localOnVirtualScrollEvt,
    $q.platform.is.ios === true ? 120 : 35
  );
  onBeforeMount(() => {
    setVirtualScrollSize();
  });
  let shouldActivate = false;
  onDeactivated(() => {
    shouldActivate = true;
  });
  onActivated(() => {
    if (shouldActivate !== true) {
      return;
    }
    const scrollEl = getVirtualScrollTarget();
    if (prevScrollStart !== void 0 && scrollEl !== void 0 && scrollEl !== null && scrollEl.nodeType !== 8) {
      setScroll(
        scrollEl,
        prevScrollStart,
        props.virtualScrollHorizontal,
        $q.lang.rtl
      );
    } else {
      scrollTo(prevToIndex);
    }
  });
  onBeforeUnmount(() => {
    onVirtualScrollEvt.cancel();
  });
  Object.assign(proxy, { scrollTo, reset, refresh });
  return {
    virtualScrollSliceRange,
    virtualScrollSliceSizeComputed,
    setVirtualScrollSize,
    onVirtualScrollEvt,
    localResetVirtualScroll,
    padVirtualScroll,
    scrollTo,
    reset,
    refresh
  };
}
const validateNewValueMode = (v) => ["add", "add-unique", "toggle"].includes(v);
const reEscapeList = ".*+?^${}()|[]\\";
const fieldPropsList = Object.keys(useFieldProps);
var QSelect = createComponent({
  name: "QSelect",
  inheritAttrs: false,
  props: {
    ...useVirtualScrollProps,
    ...useFormProps,
    ...useFieldProps,
    modelValue: {
      required: true
    },
    multiple: Boolean,
    displayValue: [String, Number],
    displayValueHtml: Boolean,
    dropdownIcon: String,
    options: {
      type: Array,
      default: () => []
    },
    optionValue: [Function, String],
    optionLabel: [Function, String],
    optionDisable: [Function, String],
    hideSelected: Boolean,
    hideDropdownIcon: Boolean,
    fillInput: Boolean,
    maxValues: [Number, String],
    optionsDense: Boolean,
    optionsDark: {
      type: Boolean,
      default: null
    },
    optionsSelectedClass: String,
    optionsHtml: Boolean,
    optionsCover: Boolean,
    menuShrink: Boolean,
    menuAnchor: String,
    menuSelf: String,
    menuOffset: Array,
    popupContentClass: String,
    popupContentStyle: [String, Array, Object],
    useInput: Boolean,
    useChips: Boolean,
    newValueMode: {
      type: String,
      validator: validateNewValueMode
    },
    mapOptions: Boolean,
    emitValue: Boolean,
    inputDebounce: {
      type: [Number, String],
      default: 500
    },
    inputClass: [Array, String, Object],
    inputStyle: [Array, String, Object],
    tabindex: {
      type: [String, Number],
      default: 0
    },
    autocomplete: String,
    transitionShow: String,
    transitionHide: String,
    transitionDuration: [String, Number],
    behavior: {
      type: String,
      validator: (v) => ["default", "menu", "dialog"].includes(v),
      default: "default"
    },
    virtualScrollItemSize: {
      type: [Number, String],
      default: void 0
    },
    onNewValue: Function,
    onFilter: Function
  },
  emits: [
    ...useFieldEmits,
    "add",
    "remove",
    "inputValue",
    "newValue",
    "keyup",
    "keypress",
    "keydown",
    "filterAbort"
  ],
  setup(props, { slots, emit }) {
    const { proxy } = getCurrentInstance();
    const { $q } = proxy;
    const menu = ref(false);
    const dialog = ref(false);
    const optionIndex = ref(-1);
    const inputValue = ref("");
    const dialogFieldFocused = ref(false);
    const innerLoadingIndicator = ref(false);
    let filterTimer = null, inputValueTimer = null, innerValueCache, hasDialog, userInputValue, filterId = null, defaultInputValue, transitionShowComputed, searchBuffer, searchBufferExp;
    const inputRef = ref(null);
    const targetRef = ref(null);
    const menuRef = ref(null);
    const dialogRef = ref(null);
    const menuContentRef = ref(null);
    const nameProp = useFormInputNameAttr(props);
    const onComposition = useKeyComposition(onInput);
    const virtualScrollLength = computed(() => Array.isArray(props.options) ? props.options.length : 0);
    const virtualScrollItemSizeComputed = computed(() => props.virtualScrollItemSize === void 0 ? props.optionsDense === true ? 24 : 48 : props.virtualScrollItemSize);
    const {
      virtualScrollSliceRange,
      virtualScrollSliceSizeComputed,
      localResetVirtualScroll,
      padVirtualScroll,
      onVirtualScrollEvt,
      scrollTo,
      setVirtualScrollSize
    } = useVirtualScroll({
      virtualScrollLength,
      getVirtualScrollTarget,
      getVirtualScrollEl,
      virtualScrollItemSizeComputed
    });
    const state = useFieldState();
    const innerValue = computed(() => {
      const mapNull = props.mapOptions === true && props.multiple !== true, val = props.modelValue !== void 0 && (props.modelValue !== null || mapNull === true) ? props.multiple === true && Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue] : [];
      if (props.mapOptions === true && Array.isArray(props.options) === true) {
        const cache = props.mapOptions === true && innerValueCache !== void 0 ? innerValueCache : [];
        const values = val.map((v) => getOption(v, cache));
        return props.modelValue === null && mapNull === true ? values.filter((v) => v !== null) : values;
      }
      return val;
    });
    const innerFieldProps = computed(() => {
      const acc = {};
      fieldPropsList.forEach((key) => {
        const val = props[key];
        if (val !== void 0) {
          acc[key] = val;
        }
      });
      return acc;
    });
    const isOptionsDark = computed(() => props.optionsDark === null ? state.isDark.value : props.optionsDark);
    const hasValue = computed(() => fieldValueIsFilled(innerValue.value));
    const computedInputClass = computed(() => {
      let cls = "q-field__input q-placeholder col";
      if (props.hideSelected === true || innerValue.value.length === 0) {
        return [cls, props.inputClass];
      }
      cls += " q-field__input--padding";
      return props.inputClass === void 0 ? cls : [cls, props.inputClass];
    });
    const menuContentClass = computed(
      () => (props.virtualScrollHorizontal === true ? "q-virtual-scroll--horizontal" : "") + (props.popupContentClass ? " " + props.popupContentClass : "")
    );
    const noOptions = computed(() => virtualScrollLength.value === 0);
    const selectedString = computed(
      () => innerValue.value.map((opt) => getOptionLabel.value(opt)).join(", ")
    );
    const ariaCurrentValue = computed(() => props.displayValue !== void 0 ? props.displayValue : selectedString.value);
    const needsHtmlFn = computed(() => props.optionsHtml === true ? () => true : (opt) => opt !== void 0 && opt !== null && opt.html === true);
    const valueAsHtml = computed(() => props.displayValueHtml === true || props.displayValue === void 0 && (props.optionsHtml === true || innerValue.value.some(needsHtmlFn.value)));
    const tabindex = computed(() => state.focused.value === true ? props.tabindex : -1);
    const comboboxAttrs = computed(() => {
      const attrs = {
        tabindex: props.tabindex,
        role: "combobox",
        "aria-label": props.label,
        "aria-readonly": props.readonly === true ? "true" : "false",
        "aria-autocomplete": props.useInput === true ? "list" : "none",
        "aria-expanded": menu.value === true ? "true" : "false",
        "aria-controls": `${state.targetUid.value}_lb`
      };
      if (optionIndex.value >= 0) {
        attrs["aria-activedescendant"] = `${state.targetUid.value}_${optionIndex.value}`;
      }
      return attrs;
    });
    const listboxAttrs = computed(() => ({
      id: `${state.targetUid.value}_lb`,
      role: "listbox",
      "aria-multiselectable": props.multiple === true ? "true" : "false"
    }));
    const selectedScope = computed(() => {
      return innerValue.value.map((opt, i) => ({
        index: i,
        opt,
        html: needsHtmlFn.value(opt),
        selected: true,
        removeAtIndex: removeAtIndexAndFocus,
        toggleOption,
        tabindex: tabindex.value
      }));
    });
    const optionScope = computed(() => {
      if (virtualScrollLength.value === 0) {
        return [];
      }
      const { from, to } = virtualScrollSliceRange.value;
      return props.options.slice(from, to).map((opt, i) => {
        const disable = isOptionDisabled.value(opt) === true;
        const index = from + i;
        const itemProps = {
          clickable: true,
          active: false,
          activeClass: computedOptionsSelectedClass.value,
          manualFocus: true,
          focused: false,
          disable,
          tabindex: -1,
          dense: props.optionsDense,
          dark: isOptionsDark.value,
          role: "option",
          id: `${state.targetUid.value}_${index}`,
          onClick: () => {
            toggleOption(opt);
          }
        };
        if (disable !== true) {
          isOptionSelected(opt) === true && (itemProps.active = true);
          optionIndex.value === index && (itemProps.focused = true);
          itemProps["aria-selected"] = itemProps.active === true ? "true" : "false";
          if ($q.platform.is.desktop === true) {
            itemProps.onMousemove = () => {
              menu.value === true && setOptionIndex(index);
            };
          }
        }
        return {
          index,
          opt,
          html: needsHtmlFn.value(opt),
          label: getOptionLabel.value(opt),
          selected: itemProps.active,
          focused: itemProps.focused,
          toggleOption,
          setOptionIndex,
          itemProps
        };
      });
    });
    const dropdownArrowIcon = computed(() => props.dropdownIcon !== void 0 ? props.dropdownIcon : $q.iconSet.arrow.dropdown);
    const squaredMenu = computed(
      () => props.optionsCover === false && props.outlined !== true && props.standout !== true && props.borderless !== true && props.rounded !== true
    );
    const computedOptionsSelectedClass = computed(() => props.optionsSelectedClass !== void 0 ? props.optionsSelectedClass : props.color !== void 0 ? `text-${props.color}` : "");
    const getOptionValue = computed(() => getPropValueFn(props.optionValue, "value"));
    const getOptionLabel = computed(() => getPropValueFn(props.optionLabel, "label"));
    const isOptionDisabled = computed(() => getPropValueFn(props.optionDisable, "disable"));
    const innerOptionsValue = computed(() => innerValue.value.map((opt) => getOptionValue.value(opt)));
    const inputControlEvents = computed(() => {
      const evt = {
        onInput,
        onChange: onComposition,
        onKeydown: onTargetKeydown,
        onKeyup: onTargetAutocomplete,
        onKeypress: onTargetKeypress,
        onFocus: selectInputText,
        onClick(e) {
          hasDialog === true && stop(e);
        }
      };
      evt.onCompositionstart = evt.onCompositionupdate = evt.onCompositionend = onComposition;
      return evt;
    });
    watch(innerValue, (val) => {
      innerValueCache = val;
      if (props.useInput === true && props.fillInput === true && props.multiple !== true && state.innerLoading.value !== true && (dialog.value !== true && menu.value !== true || hasValue.value !== true)) {
        userInputValue !== true && resetInputValue();
        if (dialog.value === true || menu.value === true) {
          filter("");
        }
      }
    }, { immediate: true });
    watch(() => props.fillInput, resetInputValue);
    watch(menu, updateMenu);
    watch(virtualScrollLength, rerenderMenu);
    function getEmittingOptionValue(opt) {
      return props.emitValue === true ? getOptionValue.value(opt) : opt;
    }
    function removeAtIndex(index) {
      if (index > -1 && index < innerValue.value.length) {
        if (props.multiple === true) {
          const model = props.modelValue.slice();
          emit("remove", { index, value: model.splice(index, 1)[0] });
          emit("update:modelValue", model);
        } else {
          emit("update:modelValue", null);
        }
      }
    }
    function removeAtIndexAndFocus(index) {
      removeAtIndex(index);
      state.focus();
    }
    function add(opt, unique) {
      const val = getEmittingOptionValue(opt);
      if (props.multiple !== true) {
        props.fillInput === true && updateInputValue(
          getOptionLabel.value(opt),
          true,
          true
        );
        emit("update:modelValue", val);
        return;
      }
      if (innerValue.value.length === 0) {
        emit("add", { index: 0, value: val });
        emit("update:modelValue", props.multiple === true ? [val] : val);
        return;
      }
      if (unique === true && isOptionSelected(opt) === true) {
        return;
      }
      if (props.maxValues !== void 0 && props.modelValue.length >= props.maxValues) {
        return;
      }
      const model = props.modelValue.slice();
      emit("add", { index: model.length, value: val });
      model.push(val);
      emit("update:modelValue", model);
    }
    function toggleOption(opt, keepOpen) {
      if (state.editable.value !== true || opt === void 0 || isOptionDisabled.value(opt) === true) {
        return;
      }
      const optValue = getOptionValue.value(opt);
      if (props.multiple !== true) {
        if (keepOpen !== true) {
          updateInputValue(
            props.fillInput === true ? getOptionLabel.value(opt) : "",
            true,
            true
          );
          hidePopup();
        }
        targetRef.value !== null && targetRef.value.focus();
        if (innerValue.value.length === 0 || isDeepEqual(getOptionValue.value(innerValue.value[0]), optValue) !== true) {
          emit("update:modelValue", props.emitValue === true ? optValue : opt);
        }
        return;
      }
      (hasDialog !== true || dialogFieldFocused.value === true) && state.focus();
      selectInputText();
      if (innerValue.value.length === 0) {
        const val = props.emitValue === true ? optValue : opt;
        emit("add", { index: 0, value: val });
        emit("update:modelValue", props.multiple === true ? [val] : val);
        return;
      }
      const model = props.modelValue.slice(), index = innerOptionsValue.value.findIndex((v) => isDeepEqual(v, optValue));
      if (index > -1) {
        emit("remove", { index, value: model.splice(index, 1)[0] });
      } else {
        if (props.maxValues !== void 0 && model.length >= props.maxValues) {
          return;
        }
        const val = props.emitValue === true ? optValue : opt;
        emit("add", { index: model.length, value: val });
        model.push(val);
      }
      emit("update:modelValue", model);
    }
    function setOptionIndex(index) {
      if ($q.platform.is.desktop !== true) {
        return;
      }
      const val = index > -1 && index < virtualScrollLength.value ? index : -1;
      if (optionIndex.value !== val) {
        optionIndex.value = val;
      }
    }
    function moveOptionSelection(offset = 1, skipInputValue) {
      if (menu.value === true) {
        let index = optionIndex.value;
        do {
          index = normalizeToInterval(
            index + offset,
            -1,
            virtualScrollLength.value - 1
          );
        } while (index !== -1 && index !== optionIndex.value && isOptionDisabled.value(props.options[index]) === true);
        if (optionIndex.value !== index) {
          setOptionIndex(index);
          scrollTo(index);
          if (skipInputValue !== true && props.useInput === true && props.fillInput === true) {
            setInputValue(
              index >= 0 ? getOptionLabel.value(props.options[index]) : defaultInputValue,
              true
            );
          }
        }
      }
    }
    function getOption(value, valueCache) {
      const fn = (opt) => isDeepEqual(getOptionValue.value(opt), value);
      return props.options.find(fn) || valueCache.find(fn) || value;
    }
    function getPropValueFn(propValue, defaultVal) {
      const val = propValue !== void 0 ? propValue : defaultVal;
      return typeof val === "function" ? val : (opt) => opt !== null && typeof opt === "object" && val in opt ? opt[val] : opt;
    }
    function isOptionSelected(opt) {
      const val = getOptionValue.value(opt);
      return innerOptionsValue.value.find((v) => isDeepEqual(v, val)) !== void 0;
    }
    function selectInputText(e) {
      if (props.useInput === true && targetRef.value !== null && (e === void 0 || targetRef.value === e.target && e.target.value === selectedString.value)) {
        targetRef.value.select();
      }
    }
    function onTargetKeyup(e) {
      if (isKeyCode(e, 27) === true && menu.value === true) {
        stop(e);
        hidePopup();
        resetInputValue();
      }
      emit("keyup", e);
    }
    function onTargetAutocomplete(e) {
      const { value } = e.target;
      if (e.keyCode !== void 0) {
        onTargetKeyup(e);
        return;
      }
      e.target.value = "";
      if (filterTimer !== null) {
        clearTimeout(filterTimer);
        filterTimer = null;
      }
      if (inputValueTimer !== null) {
        clearTimeout(inputValueTimer);
        inputValueTimer = null;
      }
      resetInputValue();
      if (typeof value === "string" && value.length !== 0) {
        const needle = value.toLocaleLowerCase();
        const findFn = (extractFn) => {
          const option = props.options.find((opt) => extractFn.value(opt).toLocaleLowerCase() === needle);
          if (option === void 0) {
            return false;
          }
          if (innerValue.value.indexOf(option) === -1) {
            toggleOption(option);
          } else {
            hidePopup();
          }
          return true;
        };
        const fillFn = (afterFilter) => {
          if (findFn(getOptionValue) === true) {
            return;
          }
          if (findFn(getOptionLabel) === true || afterFilter === true) {
            return;
          }
          filter(value, true, () => fillFn(true));
        };
        fillFn();
      } else {
        state.clearValue(e);
      }
    }
    function onTargetKeypress(e) {
      emit("keypress", e);
    }
    function onTargetKeydown(e) {
      emit("keydown", e);
      if (shouldIgnoreKey(e) === true) {
        return;
      }
      const newValueModeValid = inputValue.value.length !== 0 && (props.newValueMode !== void 0 || props.onNewValue !== void 0);
      const tabShouldSelect = e.shiftKey !== true && props.multiple !== true && (optionIndex.value > -1 || newValueModeValid === true);
      if (e.keyCode === 27) {
        prevent(e);
        return;
      }
      if (e.keyCode === 9 && tabShouldSelect === false) {
        closeMenu();
        return;
      }
      if (e.target === void 0 || e.target.id !== state.targetUid.value || state.editable.value !== true) {
        return;
      }
      if (e.keyCode === 40 && state.innerLoading.value !== true && menu.value === false) {
        stopAndPrevent(e);
        showPopup();
        return;
      }
      if (e.keyCode === 8 && (props.useChips === true || props.clearable === true) && props.hideSelected !== true && inputValue.value.length === 0) {
        if (props.multiple === true && Array.isArray(props.modelValue) === true) {
          removeAtIndex(props.modelValue.length - 1);
        } else if (props.multiple !== true && props.modelValue !== null) {
          emit("update:modelValue", null);
        }
        return;
      }
      if ((e.keyCode === 35 || e.keyCode === 36) && (typeof inputValue.value !== "string" || inputValue.value.length === 0)) {
        stopAndPrevent(e);
        optionIndex.value = -1;
        moveOptionSelection(e.keyCode === 36 ? 1 : -1, props.multiple);
      }
      if ((e.keyCode === 33 || e.keyCode === 34) && virtualScrollSliceSizeComputed.value !== void 0) {
        stopAndPrevent(e);
        optionIndex.value = Math.max(
          -1,
          Math.min(
            virtualScrollLength.value,
            optionIndex.value + (e.keyCode === 33 ? -1 : 1) * virtualScrollSliceSizeComputed.value.view
          )
        );
        moveOptionSelection(e.keyCode === 33 ? 1 : -1, props.multiple);
      }
      if (e.keyCode === 38 || e.keyCode === 40) {
        stopAndPrevent(e);
        moveOptionSelection(e.keyCode === 38 ? -1 : 1, props.multiple);
      }
      const optionsLength = virtualScrollLength.value;
      if (searchBuffer === void 0 || searchBufferExp < Date.now()) {
        searchBuffer = "";
      }
      if (optionsLength > 0 && props.useInput !== true && e.key !== void 0 && e.key.length === 1 && e.altKey === false && e.ctrlKey === false && e.metaKey === false && (e.keyCode !== 32 || searchBuffer.length !== 0)) {
        menu.value !== true && showPopup(e);
        const char = e.key.toLocaleLowerCase(), keyRepeat = searchBuffer.length === 1 && searchBuffer[0] === char;
        searchBufferExp = Date.now() + 1500;
        if (keyRepeat === false) {
          stopAndPrevent(e);
          searchBuffer += char;
        }
        const searchRe = new RegExp("^" + searchBuffer.split("").map((l) => reEscapeList.indexOf(l) > -1 ? "\\" + l : l).join(".*"), "i");
        let index = optionIndex.value;
        if (keyRepeat === true || index < 0 || searchRe.test(getOptionLabel.value(props.options[index])) !== true) {
          do {
            index = normalizeToInterval(index + 1, -1, optionsLength - 1);
          } while (index !== optionIndex.value && (isOptionDisabled.value(props.options[index]) === true || searchRe.test(getOptionLabel.value(props.options[index])) !== true));
        }
        if (optionIndex.value !== index) {
          nextTick(() => {
            setOptionIndex(index);
            scrollTo(index);
            if (index >= 0 && props.useInput === true && props.fillInput === true) {
              setInputValue(getOptionLabel.value(props.options[index]), true);
            }
          });
        }
        return;
      }
      if (e.keyCode !== 13 && (e.keyCode !== 32 || props.useInput === true || searchBuffer !== "") && (e.keyCode !== 9 || tabShouldSelect === false)) {
        return;
      }
      e.keyCode !== 9 && stopAndPrevent(e);
      if (optionIndex.value > -1 && optionIndex.value < optionsLength) {
        toggleOption(props.options[optionIndex.value]);
        return;
      }
      if (newValueModeValid === true) {
        const done = (val, mode) => {
          if (mode) {
            if (validateNewValueMode(mode) !== true) {
              return;
            }
          } else {
            mode = props.newValueMode;
          }
          updateInputValue("", props.multiple !== true, true);
          if (val === void 0 || val === null) {
            return;
          }
          const fn = mode === "toggle" ? toggleOption : add;
          fn(val, mode === "add-unique");
          if (props.multiple !== true) {
            targetRef.value !== null && targetRef.value.focus();
            hidePopup();
          }
        };
        if (props.onNewValue !== void 0) {
          emit("newValue", inputValue.value, done);
        } else {
          done(inputValue.value);
        }
        if (props.multiple !== true) {
          return;
        }
      }
      if (menu.value === true) {
        closeMenu();
      } else if (state.innerLoading.value !== true) {
        showPopup();
      }
    }
    function getVirtualScrollEl() {
      return hasDialog === true ? menuContentRef.value : menuRef.value !== null && menuRef.value.contentEl !== null ? menuRef.value.contentEl : void 0;
    }
    function getVirtualScrollTarget() {
      return getVirtualScrollEl();
    }
    function getSelection() {
      if (props.hideSelected === true) {
        return [];
      }
      if (slots["selected-item"] !== void 0) {
        return selectedScope.value.map((scope) => slots["selected-item"](scope)).slice();
      }
      if (slots.selected !== void 0) {
        return [].concat(slots.selected());
      }
      if (props.useChips === true) {
        return selectedScope.value.map((scope, i) => h(QChip, {
          key: "option-" + i,
          removable: state.editable.value === true && isOptionDisabled.value(scope.opt) !== true,
          dense: true,
          textColor: props.color,
          tabindex: tabindex.value,
          onRemove() {
            scope.removeAtIndex(i);
          }
        }, () => h("span", {
          class: "ellipsis",
          [scope.html === true ? "innerHTML" : "textContent"]: getOptionLabel.value(scope.opt)
        })));
      }
      return [
        h("span", {
          [valueAsHtml.value === true ? "innerHTML" : "textContent"]: ariaCurrentValue.value
        })
      ];
    }
    function getAllOptions() {
      if (noOptions.value === true) {
        return slots["no-option"] !== void 0 ? slots["no-option"]({ inputValue: inputValue.value }) : void 0;
      }
      const fn = slots.option !== void 0 ? slots.option : (scope) => {
        return h(QItem, {
          key: scope.index,
          ...scope.itemProps
        }, () => {
          return h(
            QItemSection,
            () => h(
              QItemLabel,
              () => h("span", {
                [scope.html === true ? "innerHTML" : "textContent"]: scope.label
              })
            )
          );
        });
      };
      let options = padVirtualScroll("div", optionScope.value.map(fn));
      if (slots["before-options"] !== void 0) {
        options = slots["before-options"]().concat(options);
      }
      return hMergeSlot(slots["after-options"], options);
    }
    function getInput(fromDialog, isTarget) {
      const attrs = isTarget === true ? { ...comboboxAttrs.value, ...state.splitAttrs.attributes.value } : void 0;
      const data = {
        ref: isTarget === true ? targetRef : void 0,
        key: "i_t",
        class: computedInputClass.value,
        style: props.inputStyle,
        value: inputValue.value !== void 0 ? inputValue.value : "",
        type: "search",
        ...attrs,
        id: isTarget === true ? state.targetUid.value : void 0,
        maxlength: props.maxlength,
        autocomplete: props.autocomplete,
        "data-autofocus": fromDialog === true || props.autofocus === true || void 0,
        disabled: props.disable === true,
        readonly: props.readonly === true,
        ...inputControlEvents.value
      };
      if (fromDialog !== true && hasDialog === true) {
        if (Array.isArray(data.class) === true) {
          data.class = [...data.class, "no-pointer-events"];
        } else {
          data.class += " no-pointer-events";
        }
      }
      return h("input", data);
    }
    function onInput(e) {
      if (filterTimer !== null) {
        clearTimeout(filterTimer);
        filterTimer = null;
      }
      if (inputValueTimer !== null) {
        clearTimeout(inputValueTimer);
        inputValueTimer = null;
      }
      if (e && e.target && e.target.qComposing === true) {
        return;
      }
      setInputValue(e.target.value || "");
      userInputValue = true;
      defaultInputValue = inputValue.value;
      if (state.focused.value !== true && (hasDialog !== true || dialogFieldFocused.value === true)) {
        state.focus();
      }
      if (props.onFilter !== void 0) {
        filterTimer = setTimeout(() => {
          filterTimer = null;
          filter(inputValue.value);
        }, props.inputDebounce);
      }
    }
    function setInputValue(val, emitImmediately) {
      if (inputValue.value !== val) {
        inputValue.value = val;
        if (emitImmediately === true || props.inputDebounce === 0 || props.inputDebounce === "0") {
          emit("inputValue", val);
        } else {
          inputValueTimer = setTimeout(() => {
            inputValueTimer = null;
            emit("inputValue", val);
          }, props.inputDebounce);
        }
      }
    }
    function updateInputValue(val, noFiltering, internal) {
      userInputValue = internal !== true;
      if (props.useInput === true) {
        setInputValue(val, true);
        if (noFiltering === true || internal !== true) {
          defaultInputValue = val;
        }
        noFiltering !== true && filter(val);
      }
    }
    function filter(val, keepClosed, afterUpdateFn) {
      if (props.onFilter === void 0 || keepClosed !== true && state.focused.value !== true) {
        return;
      }
      if (state.innerLoading.value === true) {
        emit("filterAbort");
      } else {
        state.innerLoading.value = true;
        innerLoadingIndicator.value = true;
      }
      if (val !== "" && props.multiple !== true && innerValue.value.length !== 0 && userInputValue !== true && val === getOptionLabel.value(innerValue.value[0])) {
        val = "";
      }
      const localFilterId = setTimeout(() => {
        menu.value === true && (menu.value = false);
      }, 10);
      filterId !== null && clearTimeout(filterId);
      filterId = localFilterId;
      emit(
        "filter",
        val,
        (fn, afterFn) => {
          if ((keepClosed === true || state.focused.value === true) && filterId === localFilterId) {
            clearTimeout(filterId);
            typeof fn === "function" && fn();
            innerLoadingIndicator.value = false;
            nextTick(() => {
              state.innerLoading.value = false;
              if (state.editable.value === true) {
                if (keepClosed === true) {
                  menu.value === true && hidePopup();
                } else if (menu.value === true) {
                  updateMenu(true);
                } else {
                  menu.value = true;
                }
              }
              typeof afterFn === "function" && nextTick(() => {
                afterFn(proxy);
              });
              typeof afterUpdateFn === "function" && nextTick(() => {
                afterUpdateFn(proxy);
              });
            });
          }
        },
        () => {
          if (state.focused.value === true && filterId === localFilterId) {
            clearTimeout(filterId);
            state.innerLoading.value = false;
            innerLoadingIndicator.value = false;
          }
          menu.value === true && (menu.value = false);
        }
      );
    }
    function getMenu() {
      return h(QMenu, {
        ref: menuRef,
        class: menuContentClass.value,
        style: props.popupContentStyle,
        modelValue: menu.value,
        fit: props.menuShrink !== true,
        cover: props.optionsCover === true && noOptions.value !== true && props.useInput !== true,
        anchor: props.menuAnchor,
        self: props.menuSelf,
        offset: props.menuOffset,
        dark: isOptionsDark.value,
        noParentEvent: true,
        noRefocus: true,
        noFocus: true,
        square: squaredMenu.value,
        transitionShow: props.transitionShow,
        transitionHide: props.transitionHide,
        transitionDuration: props.transitionDuration,
        separateClosePopup: true,
        ...listboxAttrs.value,
        onScrollPassive: onVirtualScrollEvt,
        onBeforeShow: onControlPopupShow,
        onBeforeHide: onMenuBeforeHide,
        onShow: onMenuShow
      }, getAllOptions);
    }
    function onMenuBeforeHide(e) {
      onControlPopupHide(e);
      closeMenu();
    }
    function onMenuShow() {
      setVirtualScrollSize();
    }
    function onDialogFieldFocus(e) {
      stop(e);
      targetRef.value !== null && targetRef.value.focus();
      dialogFieldFocused.value = true;
      window.scrollTo(window.pageXOffset || window.scrollX || document.body.scrollLeft || 0, 0);
    }
    function onDialogFieldBlur(e) {
      stop(e);
      nextTick(() => {
        dialogFieldFocused.value = false;
      });
    }
    function getDialog() {
      const content = [
        h(QField, {
          class: `col-auto ${state.fieldClass.value}`,
          ...innerFieldProps.value,
          for: state.targetUid.value,
          dark: isOptionsDark.value,
          square: true,
          loading: innerLoadingIndicator.value,
          itemAligned: false,
          filled: true,
          stackLabel: inputValue.value.length !== 0,
          ...state.splitAttrs.listeners.value,
          onFocus: onDialogFieldFocus,
          onBlur: onDialogFieldBlur
        }, {
          ...slots,
          rawControl: () => state.getControl(true),
          before: void 0,
          after: void 0
        })
      ];
      menu.value === true && content.push(
        h("div", {
          ref: menuContentRef,
          class: menuContentClass.value + " scroll",
          style: props.popupContentStyle,
          ...listboxAttrs.value,
          onClick: prevent,
          onScrollPassive: onVirtualScrollEvt
        }, getAllOptions())
      );
      return h(QDialog, {
        ref: dialogRef,
        modelValue: dialog.value,
        position: props.useInput === true ? "top" : void 0,
        transitionShow: transitionShowComputed,
        transitionHide: props.transitionHide,
        transitionDuration: props.transitionDuration,
        onBeforeShow: onControlPopupShow,
        onBeforeHide: onDialogBeforeHide,
        onHide: onDialogHide,
        onShow: onDialogShow
      }, () => h("div", {
        class: "q-select__dialog" + (isOptionsDark.value === true ? " q-select__dialog--dark q-dark" : "") + (dialogFieldFocused.value === true ? " q-select__dialog--focused" : "")
      }, content));
    }
    function onDialogBeforeHide(e) {
      onControlPopupHide(e);
      if (dialogRef.value !== null) {
        dialogRef.value.__updateRefocusTarget(
          state.rootRef.value.querySelector(".q-field__native > [tabindex]:last-child")
        );
      }
      state.focused.value = false;
    }
    function onDialogHide(e) {
      hidePopup();
      state.focused.value === false && emit("blur", e);
      resetInputValue();
    }
    function onDialogShow() {
      const el = document.activeElement;
      if ((el === null || el.id !== state.targetUid.value) && targetRef.value !== null && targetRef.value !== el) {
        targetRef.value.focus();
      }
      setVirtualScrollSize();
    }
    function closeMenu() {
      if (dialog.value === true) {
        return;
      }
      optionIndex.value = -1;
      if (menu.value === true) {
        menu.value = false;
      }
      if (state.focused.value === false) {
        if (filterId !== null) {
          clearTimeout(filterId);
          filterId = null;
        }
        if (state.innerLoading.value === true) {
          emit("filterAbort");
          state.innerLoading.value = false;
          innerLoadingIndicator.value = false;
        }
      }
    }
    function showPopup(e) {
      if (state.editable.value !== true) {
        return;
      }
      if (hasDialog === true) {
        state.onControlFocusin(e);
        dialog.value = true;
        nextTick(() => {
          state.focus();
        });
      } else {
        state.focus();
      }
      if (props.onFilter !== void 0) {
        filter(inputValue.value);
      } else if (noOptions.value !== true || slots["no-option"] !== void 0) {
        menu.value = true;
      }
    }
    function hidePopup() {
      dialog.value = false;
      closeMenu();
    }
    function resetInputValue() {
      props.useInput === true && updateInputValue(
        props.multiple !== true && props.fillInput === true && innerValue.value.length !== 0 ? getOptionLabel.value(innerValue.value[0]) || "" : "",
        true,
        true
      );
    }
    function updateMenu(show) {
      let optionIndex2 = -1;
      if (show === true) {
        if (innerValue.value.length !== 0) {
          const val = getOptionValue.value(innerValue.value[0]);
          optionIndex2 = props.options.findIndex((v) => isDeepEqual(getOptionValue.value(v), val));
        }
        localResetVirtualScroll(optionIndex2);
      }
      setOptionIndex(optionIndex2);
    }
    function rerenderMenu(newLength, oldLength) {
      if (menu.value === true && state.innerLoading.value === false) {
        localResetVirtualScroll(-1, true);
        nextTick(() => {
          if (menu.value === true && state.innerLoading.value === false) {
            if (newLength > oldLength) {
              localResetVirtualScroll();
            } else {
              updateMenu(true);
            }
          }
        });
      }
    }
    function updateMenuPosition() {
      if (dialog.value === false && menuRef.value !== null) {
        menuRef.value.updatePosition();
      }
    }
    function onControlPopupShow(e) {
      e !== void 0 && stop(e);
      emit("popupShow", e);
      state.hasPopupOpen = true;
      state.onControlFocusin(e);
    }
    function onControlPopupHide(e) {
      e !== void 0 && stop(e);
      emit("popupHide", e);
      state.hasPopupOpen = false;
      state.onControlFocusout(e);
    }
    function updatePreState() {
      hasDialog = $q.platform.is.mobile !== true && props.behavior !== "dialog" ? false : props.behavior !== "menu" && (props.useInput === true ? slots["no-option"] !== void 0 || props.onFilter !== void 0 || noOptions.value === false : true);
      transitionShowComputed = $q.platform.is.ios === true && hasDialog === true && props.useInput === true ? "fade" : props.transitionShow;
    }
    onBeforeUpdate(updatePreState);
    onUpdated(updateMenuPosition);
    updatePreState();
    onBeforeUnmount(() => {
      filterTimer !== null && clearTimeout(filterTimer);
      inputValueTimer !== null && clearTimeout(inputValueTimer);
    });
    Object.assign(proxy, {
      showPopup,
      hidePopup,
      removeAtIndex,
      add,
      toggleOption,
      getOptionIndex: () => optionIndex.value,
      setOptionIndex,
      moveOptionSelection,
      filter,
      updateMenuPosition,
      updateInputValue,
      isOptionSelected,
      getEmittingOptionValue,
      isOptionDisabled: (...args) => isOptionDisabled.value.apply(null, args) === true,
      getOptionValue: (...args) => getOptionValue.value.apply(null, args),
      getOptionLabel: (...args) => getOptionLabel.value.apply(null, args)
    });
    Object.assign(state, {
      innerValue,
      fieldClass: computed(
        () => `q-select q-field--auto-height q-select--with${props.useInput !== true ? "out" : ""}-input q-select--with${props.useChips !== true ? "out" : ""}-chips q-select--${props.multiple === true ? "multiple" : "single"}`
      ),
      inputRef,
      targetRef,
      hasValue,
      showPopup,
      floatingLabel: computed(
        () => props.hideSelected !== true && hasValue.value === true || typeof inputValue.value === "number" || inputValue.value.length !== 0 || fieldValueIsFilled(props.displayValue)
      ),
      getControlChild: () => {
        if (state.editable.value !== false && (dialog.value === true || noOptions.value !== true || slots["no-option"] !== void 0)) {
          return hasDialog === true ? getDialog() : getMenu();
        } else if (state.hasPopupOpen === true) {
          state.hasPopupOpen = false;
        }
      },
      controlEvents: {
        onFocusin(e) {
          state.onControlFocusin(e);
        },
        onFocusout(e) {
          state.onControlFocusout(e, () => {
            resetInputValue();
            closeMenu();
          });
        },
        onClick(e) {
          prevent(e);
          if (hasDialog !== true && menu.value === true) {
            closeMenu();
            targetRef.value !== null && targetRef.value.focus();
            return;
          }
          showPopup(e);
        }
      },
      getControl: (fromDialog) => {
        const child = getSelection();
        const isTarget = fromDialog === true || dialog.value !== true || hasDialog !== true;
        if (props.useInput === true) {
          child.push(getInput(fromDialog, isTarget));
        } else if (state.editable.value === true) {
          const attrs2 = isTarget === true ? comboboxAttrs.value : void 0;
          child.push(
            h("input", {
              ref: isTarget === true ? targetRef : void 0,
              key: "d_t",
              class: "q-select__focus-target",
              id: isTarget === true ? state.targetUid.value : void 0,
              value: ariaCurrentValue.value,
              readonly: true,
              "data-autofocus": fromDialog === true || props.autofocus === true || void 0,
              ...attrs2,
              onKeydown: onTargetKeydown,
              onKeyup: onTargetKeyup,
              onKeypress: onTargetKeypress
            })
          );
          if (isTarget === true && typeof props.autocomplete === "string" && props.autocomplete.length !== 0) {
            child.push(
              h("input", {
                class: "q-select__autocomplete-input",
                autocomplete: props.autocomplete,
                tabindex: -1,
                onKeyup: onTargetAutocomplete
              })
            );
          }
        }
        if (nameProp.value !== void 0 && props.disable !== true && innerOptionsValue.value.length !== 0) {
          const opts = innerOptionsValue.value.map((value) => h("option", { value, selected: true }));
          child.push(
            h("select", {
              class: "hidden",
              name: nameProp.value,
              multiple: props.multiple
            }, opts)
          );
        }
        const attrs = props.useInput === true || isTarget !== true ? void 0 : state.splitAttrs.attributes.value;
        return h("div", {
          class: "q-field__native row items-center",
          ...attrs,
          ...state.splitAttrs.listeners.value
        }, child);
      },
      getInnerAppend: () => props.loading !== true && innerLoadingIndicator.value !== true && props.hideDropdownIcon !== true ? [
        h(QIcon, {
          class: "q-select__dropdown-icon" + (menu.value === true ? " rotate-180" : ""),
          name: dropdownArrowIcon.value
        })
      ] : null
    });
    return useField(state);
  }
});
function useRefocusTarget(props, rootRef) {
  const refocusRef = ref(null);
  const refocusTargetEl = computed(() => {
    if (props.disable === true) {
      return null;
    }
    return h("span", {
      ref: refocusRef,
      class: "no-outline",
      tabindex: -1
    });
  });
  function refocusTarget(e) {
    const root = rootRef.value;
    if (e !== void 0 && e.type.indexOf("key") === 0) {
      if (root !== null && document.activeElement !== root && root.contains(document.activeElement) === true) {
        root.focus();
      }
    } else if (refocusRef.value !== null && (e === void 0 || root !== null && root.contains(e.target) === true)) {
      refocusRef.value.focus();
    }
  }
  return {
    refocusTargetEl,
    refocusTarget
  };
}
var optionSizes = {
  xs: 30,
  sm: 35,
  md: 40,
  lg: 50,
  xl: 60
};
const useCheckboxProps = {
  ...useDarkProps,
  ...useSizeProps,
  ...useFormProps,
  modelValue: {
    required: true,
    default: null
  },
  val: {},
  trueValue: { default: true },
  falseValue: { default: false },
  indeterminateValue: { default: null },
  checkedIcon: String,
  uncheckedIcon: String,
  indeterminateIcon: String,
  toggleOrder: {
    type: String,
    validator: (v) => v === "tf" || v === "ft"
  },
  toggleIndeterminate: Boolean,
  label: String,
  leftLabel: Boolean,
  color: String,
  keepColor: Boolean,
  dense: Boolean,
  disable: Boolean,
  tabindex: [String, Number]
};
const useCheckboxEmits = ["update:modelValue"];
function useCheckbox(type, getInner) {
  const { props, slots, emit, proxy } = getCurrentInstance();
  const { $q } = proxy;
  const isDark = useDark(props, $q);
  const rootRef = ref(null);
  const { refocusTargetEl, refocusTarget } = useRefocusTarget(props, rootRef);
  const sizeStyle = useSize(props, optionSizes);
  const modelIsArray = computed(
    () => props.val !== void 0 && Array.isArray(props.modelValue)
  );
  const index = computed(() => {
    const val = toRaw(props.val);
    return modelIsArray.value === true ? props.modelValue.findIndex((opt) => toRaw(opt) === val) : -1;
  });
  const isTrue = computed(() => modelIsArray.value === true ? index.value > -1 : toRaw(props.modelValue) === toRaw(props.trueValue));
  const isFalse = computed(() => modelIsArray.value === true ? index.value === -1 : toRaw(props.modelValue) === toRaw(props.falseValue));
  const isIndeterminate = computed(
    () => isTrue.value === false && isFalse.value === false
  );
  const tabindex = computed(() => props.disable === true ? -1 : props.tabindex || 0);
  const classes = computed(
    () => `q-${type} cursor-pointer no-outline row inline no-wrap items-center` + (props.disable === true ? " disabled" : "") + (isDark.value === true ? ` q-${type}--dark` : "") + (props.dense === true ? ` q-${type}--dense` : "") + (props.leftLabel === true ? " reverse" : "")
  );
  const innerClass = computed(() => {
    const state = isTrue.value === true ? "truthy" : isFalse.value === true ? "falsy" : "indet";
    const color = props.color !== void 0 && (props.keepColor === true || (type === "toggle" ? isTrue.value === true : isFalse.value !== true)) ? ` text-${props.color}` : "";
    return `q-${type}__inner relative-position non-selectable q-${type}__inner--${state}${color}`;
  });
  const formAttrs = computed(() => {
    const prop = { type: "checkbox" };
    props.name !== void 0 && Object.assign(prop, {
      ".checked": isTrue.value,
      "^checked": isTrue.value === true ? "checked" : void 0,
      name: props.name,
      value: modelIsArray.value === true ? props.val : props.trueValue
    });
    return prop;
  });
  const injectFormInput = useFormInject(formAttrs);
  const attributes = computed(() => {
    const attrs = {
      tabindex: tabindex.value,
      role: type === "toggle" ? "switch" : "checkbox",
      "aria-label": props.label,
      "aria-checked": isIndeterminate.value === true ? "mixed" : isTrue.value === true ? "true" : "false"
    };
    if (props.disable === true) {
      attrs["aria-disabled"] = "true";
    }
    return attrs;
  });
  function onClick(e) {
    if (e !== void 0) {
      stopAndPrevent(e);
      refocusTarget(e);
    }
    if (props.disable !== true) {
      emit("update:modelValue", getNextValue(), e);
    }
  }
  function getNextValue() {
    if (modelIsArray.value === true) {
      if (isTrue.value === true) {
        const val = props.modelValue.slice();
        val.splice(index.value, 1);
        return val;
      }
      return props.modelValue.concat([props.val]);
    }
    if (isTrue.value === true) {
      if (props.toggleOrder !== "ft" || props.toggleIndeterminate === false) {
        return props.falseValue;
      }
    } else if (isFalse.value === true) {
      if (props.toggleOrder === "ft" || props.toggleIndeterminate === false) {
        return props.trueValue;
      }
    } else {
      return props.toggleOrder !== "ft" ? props.trueValue : props.falseValue;
    }
    return props.indeterminateValue;
  }
  function onKeydown(e) {
    if (e.keyCode === 13 || e.keyCode === 32) {
      stopAndPrevent(e);
    }
  }
  function onKeyup(e) {
    if (e.keyCode === 13 || e.keyCode === 32) {
      onClick(e);
    }
  }
  const getInnerContent = getInner(isTrue, isIndeterminate);
  Object.assign(proxy, { toggle: onClick });
  return () => {
    const inner = getInnerContent();
    props.disable !== true && injectFormInput(
      inner,
      "unshift",
      ` q-${type}__native absolute q-ma-none q-pa-none`
    );
    const child = [
      h("div", {
        class: innerClass.value,
        style: sizeStyle.value,
        "aria-hidden": "true"
      }, inner)
    ];
    if (refocusTargetEl.value !== null) {
      child.push(refocusTargetEl.value);
    }
    const label = props.label !== void 0 ? hMergeSlot(slots.default, [props.label]) : hSlot(slots.default);
    label !== void 0 && child.push(
      h("div", {
        class: `q-${type}__label q-anchor--skip`
      }, label)
    );
    return h("div", {
      ref: rootRef,
      class: classes.value,
      ...attributes.value,
      onClick,
      onKeydown,
      onKeyup
    }, child);
  };
}
var QToggle = createComponent({
  name: "QToggle",
  props: {
    ...useCheckboxProps,
    icon: String,
    iconColor: String
  },
  emits: useCheckboxEmits,
  setup(props) {
    function getInner(isTrue, isIndeterminate) {
      const icon = computed(
        () => (isTrue.value === true ? props.checkedIcon : isIndeterminate.value === true ? props.indeterminateIcon : props.uncheckedIcon) || props.icon
      );
      const color = computed(() => isTrue.value === true ? props.iconColor : null);
      return () => [
        h("div", { class: "q-toggle__track" }),
        h(
          "div",
          {
            class: "q-toggle__thumb absolute flex flex-center no-wrap"
          },
          icon.value !== void 0 ? [
            h(QIcon, {
              name: icon.value,
              color: color.value
            })
          ] : void 0
        )
      ];
    }
    return useCheckbox("toggle", getInner);
  }
});
var QForm = createComponent({
  name: "QForm",
  props: {
    autofocus: Boolean,
    noErrorFocus: Boolean,
    noResetFocus: Boolean,
    greedy: Boolean,
    onSubmit: Function
  },
  emits: ["reset", "validationSuccess", "validationError"],
  setup(props, { slots, emit }) {
    const vm = getCurrentInstance();
    const rootRef = ref(null);
    let validateIndex = 0;
    const registeredComponents = [];
    function validate(shouldFocus) {
      const focus2 = typeof shouldFocus === "boolean" ? shouldFocus : props.noErrorFocus !== true;
      const index = ++validateIndex;
      const emitEvent = (res, ref2) => {
        emit("validation" + (res === true ? "Success" : "Error"), ref2);
      };
      const validateComponent = (comp) => {
        const valid = comp.validate();
        return typeof valid.then === "function" ? valid.then(
          (valid2) => ({ valid: valid2, comp }),
          (err) => ({ valid: false, comp, err })
        ) : Promise.resolve({ valid, comp });
      };
      const errorsPromise = props.greedy === true ? Promise.all(registeredComponents.map(validateComponent)).then((res) => res.filter((r) => r.valid !== true)) : registeredComponents.reduce(
        (acc, comp) => acc.then(() => {
          return validateComponent(comp).then((r) => {
            if (r.valid === false) {
              return Promise.reject(r);
            }
          });
        }),
        Promise.resolve()
      ).catch((error) => [error]);
      return errorsPromise.then((errors) => {
        if (errors === void 0 || errors.length === 0) {
          index === validateIndex && emitEvent(true);
          return true;
        }
        if (index === validateIndex) {
          const { comp, err } = errors[0];
          err !== void 0 && console.error(err);
          emitEvent(false, comp);
          if (focus2 === true) {
            const activeError = errors.find(({ comp: comp2 }) => typeof comp2.focus === "function" && vmIsDestroyed(comp2.$) === false);
            if (activeError !== void 0) {
              activeError.comp.focus();
            }
          }
        }
        return false;
      });
    }
    function resetValidation() {
      validateIndex++;
      registeredComponents.forEach((comp) => {
        typeof comp.resetValidation === "function" && comp.resetValidation();
      });
    }
    function submit(evt) {
      evt !== void 0 && stopAndPrevent(evt);
      const index = validateIndex + 1;
      validate().then((val) => {
        if (index === validateIndex && val === true) {
          if (props.onSubmit !== void 0) {
            emit("submit", evt);
          } else if (evt !== void 0 && evt.target !== void 0 && typeof evt.target.submit === "function") {
            evt.target.submit();
          }
        }
      });
    }
    function reset(evt) {
      evt !== void 0 && stopAndPrevent(evt);
      emit("reset");
      nextTick(() => {
        resetValidation();
        if (props.autofocus === true && props.noResetFocus !== true) {
          focus();
        }
      });
    }
    function focus() {
      addFocusFn(() => {
        if (rootRef.value === null) {
          return;
        }
        const target = rootRef.value.querySelector("[autofocus][tabindex], [data-autofocus][tabindex]") || rootRef.value.querySelector("[autofocus] [tabindex], [data-autofocus] [tabindex]") || rootRef.value.querySelector("[autofocus], [data-autofocus]") || Array.prototype.find.call(rootRef.value.querySelectorAll("[tabindex]"), (el) => el.tabIndex > -1);
        target !== null && target !== void 0 && target.focus({ preventScroll: true });
      });
    }
    provide(formKey, {
      bindComponent(vmProxy) {
        registeredComponents.push(vmProxy);
      },
      unbindComponent(vmProxy) {
        const index = registeredComponents.indexOf(vmProxy);
        if (index > -1) {
          registeredComponents.splice(index, 1);
        }
      }
    });
    let shouldActivate = false;
    onDeactivated(() => {
      shouldActivate = true;
    });
    onActivated(() => {
      shouldActivate === true && props.autofocus === true && focus();
    });
    onMounted(() => {
      props.autofocus === true && focus();
    });
    Object.assign(vm.proxy, {
      validate,
      resetValidation,
      submit,
      reset,
      focus,
      getValidationComponents: () => registeredComponents
    });
    return () => h("form", {
      class: "q-form",
      ref: rootRef,
      onSubmit: submit,
      onReset: reset
    }, hSlot(slots.default));
  }
});
var TrieSearch$1 = { exports: {} };
var jclass = { exports: {} };
(function(module, exports) {
  (function(factory) {
    {
      exports = factory();
      {
        module.exports = exports;
      }
    }
  })(function() {
    var isFn = function(obj) {
      return obj instanceof Function;
    };
    var extend = function(target) {
      var sources = Array.prototype.slice.call(arguments, 1);
      for (var i in sources) {
        var source = sources[i];
        if (typeof source != "object") {
          continue;
        }
        for (var key in source) {
          target[key] = source[key];
        }
      }
      return target;
    };
    var defaultOptions = {
      _isClassObject: false
    };
    var initializing = false;
    var BaseClass = function() {
    };
    BaseClass._subClasses = [];
    BaseClass.prototype.init = function() {
    };
    BaseClass._extend = function(instanceMembers, classMembers, options) {
      if (instanceMembers === void 0) {
        instanceMembers = {};
      }
      if (classMembers === void 0) {
        classMembers = {};
      }
      if (options === void 0) {
        options = {};
      }
      options = extend({}, defaultOptions, options);
      var JClass2 = function() {
        if (initializing) {
          return;
        }
        this._class = JClass2;
        if (this.init instanceof Function) {
          this.init.apply(this, arguments);
        }
      };
      var SuperClass = this;
      initializing = true;
      var prototype = new SuperClass();
      initializing = false;
      var superPrototype = SuperClass.prototype;
      JClass2.prototype = prototype;
      JClass2.prototype.constructor = JClass2;
      JClass2._superClass = SuperClass;
      JClass2._subClasses = [];
      SuperClass._subClasses.push(JClass2);
      JClass2._extend = SuperClass._extend;
      JClass2._extends = function(target) {
        if (this._superClass == BaseClass) {
          return false;
        }
        if (target == this._superClass || target == BaseClass) {
          return true;
        }
        return this._superClass._extends(target);
      };
      for (var key in instanceMembers) {
        var property = Object.getOwnPropertyDescriptor(instanceMembers, key);
        var member = property.value;
        if (member !== null && typeof member == "object" && member.descriptor) {
          Object.defineProperty(prototype, key, member);
        } else if (!("value" in property) && ("set" in property || "get" in property)) {
          Object.defineProperty(prototype, key, property);
        } else {
          prototype[key] = member;
          var superMember = superPrototype[key];
          if (isFn(member) && isFn(superMember) && member !== superMember) {
            member._super = superMember;
          }
        }
      }
      if (!options._isClassObject) {
        var ClassMembersSuperClass = SuperClass._members === void 0 ? BaseClass : SuperClass._members._class;
        var opts = extend({}, options, { _isClassObject: true });
        var ClassMembersClass = ClassMembersSuperClass._extend(classMembers, {}, opts);
        ClassMembersClass._instanceClass = JClass2;
        JClass2._members = new ClassMembersClass();
      }
      return JClass2;
    };
    BaseClass._convert = function(cls, options) {
      var instanceMembers = cls.prototype;
      instanceMembers.init = function() {
        var origin = this._origin = BaseClass._construct(cls, arguments);
        Object.keys(origin).forEach(function(key) {
          if (!origin.hasOwnProperty(key)) {
            return;
          }
          Object.defineProperty(this, key, {
            get: function() {
              return origin[key];
            }
          });
        }, this);
      };
      return BaseClass._extend(instanceMembers, {}, options);
    };
    BaseClass._construct = function(cls, args) {
      if (args === void 0) {
        args = [];
      }
      var Class = function() {
        return cls.apply(this, args);
      };
      Class.prototype = cls.prototype;
      return new Class();
    };
    BaseClass._superDescriptor = function(cls, prop) {
      if ("_class" in cls && cls instanceof cls._class) {
        cls = cls._class;
      }
      if ("_extends" in cls && cls._extends instanceof Function && cls._extends(this)) {
        return Object.getOwnPropertyDescriptor(cls._superClass.prototype, prop);
      } else {
        return void 0;
      }
    };
    return BaseClass;
  });
})(jclass, jclass.exports);
var JClass = jclass.exports;
var HashArray$1 = JClass._extend({
  init: function(keyFields, callback, options) {
    keyFields = keyFields instanceof Array ? keyFields : [keyFields];
    this._map = {};
    this._list = [];
    this.callback = callback;
    this.keyFields = keyFields;
    this.isHashArray = true;
    this.options = options || {
      ignoreDuplicates: false
    };
    if (callback) {
      callback("construct");
    }
  },
  addOne: function(obj) {
    var needsDupCheck = false;
    for (var key in this.keyFields) {
      key = this.keyFields[key];
      var inst = this.objectAt(obj, key);
      if (inst) {
        if (this.has(inst)) {
          if (this.options.ignoreDuplicates)
            return;
          if (this._map[inst].indexOf(obj) != -1) {
            needsDupCheck = true;
            continue;
          }
          this._map[inst].push(obj);
        } else
          this._map[inst] = [obj];
      }
    }
    if (!needsDupCheck || this._list.indexOf(obj) == -1)
      this._list.push(obj);
  },
  add: function() {
    for (var i = 0; i < arguments.length; i++) {
      this.addOne(arguments[i]);
    }
    if (this.callback) {
      this.callback("add", Array.prototype.slice.call(arguments, 0));
    }
    return this;
  },
  addAll: function(arr) {
    if (arr.length < 100)
      this.add.apply(this, arr);
    else {
      for (var i = 0; i < arr.length; i++)
        this.add(arr[i]);
    }
    return this;
  },
  addMap: function(key, obj) {
    this._map[key] = obj;
    if (this.callback) {
      this.callback("addMap", {
        key,
        obj
      });
    }
    return this;
  },
  intersection: function(other) {
    var self = this;
    if (!other || !other.isHashArray)
      throw Error("Cannot HashArray.intersection() on a non-hasharray object. You passed in: ", other);
    var ret = this.clone(null, true), allItems = this.clone(null, true).addAll(this.all.concat(other.all));
    allItems.all.forEach(function(item) {
      if (self.collides(item) && other.collides(item))
        ret.add(item);
    });
    return ret;
  },
  complement: function(other) {
    if (!other || !other.isHashArray)
      throw Error("Cannot HashArray.complement() on a non-hasharray object. You passed in: ", other);
    var ret = this.clone(null, true);
    this.all.forEach(function(item) {
      if (!other.collides(item))
        ret.add(item);
    });
    return ret;
  },
  get: function(key) {
    if (!this.has(key))
      return;
    return !(this._map[key] instanceof Array) || this._map[key].length != 1 ? this._map[key] : this._map[key][0];
  },
  getAll: function(keys) {
    keys = keys instanceof Array ? keys : [keys];
    if (keys[0] == "*")
      return this.all;
    var res = new HashArray$1(this.keyFields);
    for (var key in keys)
      res.add.apply(res, this.getAsArray(keys[key]));
    return res.all;
  },
  getAsArray: function(key) {
    return this._map[key] || [];
  },
  getUniqueRandomIntegers: function(count, min, max) {
    var res = [], map = {};
    count = Math.min(Math.max(max - min, 1), count);
    while (res.length < count) {
      var r = Math.floor(min + Math.random() * (max + 1));
      if (map[r])
        continue;
      map[r] = true;
      res.push(r);
    }
    return res;
  },
  sample: function(count, keys) {
    var image = this.all, res = [];
    if (keys)
      image = this.getAll(keys);
    var rand = this.getUniqueRandomIntegers(count, 0, image.length - 1);
    for (var i = 0; i < rand.length; i++)
      res.push(image[rand[i]]);
    return res;
  },
  has: function(key) {
    return this._map.hasOwnProperty(key);
  },
  collides: function(item) {
    for (var k in this.keyFields)
      if (this.has(this.objectAt(item, this.keyFields[k])))
        return true;
    return false;
  },
  hasMultiple: function(key) {
    return this._map[key] instanceof Array;
  },
  removeByKey: function() {
    var removed = [];
    for (var i = 0; i < arguments.length; i++) {
      var key = arguments[i];
      var items = this._map[key].concat();
      if (items) {
        removed = removed.concat(items);
        for (var j in items) {
          var item = items[j];
          for (var ix in this.keyFields) {
            var key2 = this.objectAt(item, this.keyFields[ix]);
            if (key2 && this.has(key2)) {
              var ix = this._map[key2].indexOf(item);
              if (ix != -1) {
                this._map[key2].splice(ix, 1);
              }
              if (this._map[key2].length == 0)
                delete this._map[key2];
            }
          }
          this._list.splice(this._list.indexOf(item), 1);
        }
      }
      delete this._map[key];
    }
    if (this.callback) {
      this.callback("removeByKey", removed);
    }
    return this;
  },
  remove: function() {
    for (var i = 0; i < arguments.length; i++) {
      var item = arguments[i];
      for (var ix in this.keyFields) {
        var key = this.objectAt(item, this.keyFields[ix]);
        if (key) {
          var ix = this._map[key].indexOf(item);
          if (ix != -1)
            this._map[key].splice(ix, 1);
          else
            throw new Error("HashArray: attempting to remove an object that was never added!" + key);
          if (this._map[key].length == 0)
            delete this._map[key];
        }
      }
      var ix = this._list.indexOf(item);
      if (ix != -1)
        this._list.splice(ix, 1);
      else
        throw new Error("HashArray: attempting to remove an object that was never added!" + key);
    }
    if (this.callback) {
      this.callback("remove", arguments);
    }
    return this;
  },
  removeAll: function() {
    var old = this._list.concat();
    this._map = {};
    this._list = [];
    if (this.callback) {
      this.callback("remove", old);
    }
    return this;
  },
  objectAt: function(obj, path) {
    if (typeof path === "string") {
      return obj[path];
    }
    var dup = path.concat();
    while (dup.length && obj) {
      obj = obj[dup.shift()];
    }
    return obj;
  },
  forEach: function(keys, callback) {
    keys = keys instanceof Array ? keys : [keys];
    var objs = this.getAll(keys);
    objs.forEach(callback);
    return this;
  },
  forEachDeep: function(keys, key, callback) {
    keys = keys instanceof Array ? keys : [keys];
    var self = this, objs = this.getAll(keys);
    objs.forEach(function(item) {
      callback(self.objectAt(item, key), item);
    });
    return this;
  },
  clone: function(callback, ignoreItems) {
    var n = new HashArray$1(this.keyFields.concat(), callback ? callback : this.callback);
    if (!ignoreItems)
      n.add.apply(n, this.all.concat());
    return n;
  },
  sum: function(keys, key, weightKey) {
    var self = this, ret = 0;
    this.forEachDeep(keys, key, function(value, item) {
      if (weightKey !== void 0)
        value *= self.objectAt(item, weightKey);
      ret += value;
    });
    return ret;
  },
  average: function(keys, key, weightKey) {
    var ret = 0, tot = 0, weightsTotal = 0, self = this;
    if (weightKey !== void 0)
      this.forEachDeep(keys, weightKey, function(value) {
        weightsTotal += value;
      });
    this.forEachDeep(keys, key, function(value, item) {
      if (weightKey !== void 0)
        value *= self.objectAt(item, weightKey) / weightsTotal;
      ret += value;
      tot++;
    });
    return weightKey !== void 0 ? ret : ret / tot;
  },
  filter: function(keys, callbackOrKey) {
    var self = this;
    var callback = typeof callbackOrKey == "function" ? callbackOrKey : defaultCallback;
    var ha = new HashArray$1(this.keyFields);
    ha.addAll(this.getAll(keys).filter(callback));
    return ha;
    function defaultCallback(item) {
      var val = self.objectAt(item, callbackOrKey);
      return val !== void 0 && val !== false;
    }
  }
});
Object.defineProperty(HashArray$1.prototype, "all", {
  get: function() {
    return this._list;
  }
});
Object.defineProperty(HashArray$1.prototype, "map", {
  get: function() {
    return this._map;
  }
});
var HashArray_1 = HashArray$1;
if (typeof window !== "undefined")
  window.HashArray = HashArray$1;
var hasharray = HashArray_1;
var HashArray = hasharray;
var MAX_CACHE_SIZE = 64;
var IS_WHITESPACE = /^[\s]*$/;
var DEFAULT_INTERNATIONALIZE_EXPAND_REGEXES = [
  {
    regex: /[åäàáâãæ]/ig,
    alternate: "a"
  },
  {
    regex: /[èéêë]/ig,
    alternate: "e"
  },
  {
    regex: /[ìíîï]/ig,
    alternate: "i"
  },
  {
    regex: /[òóôõö]/ig,
    alternate: "o"
  },
  {
    regex: /[ùúûü]/ig,
    alternate: "u"
  },
  {
    regex: /[æ]/ig,
    alternate: "ae"
  }
];
String.prototype.replaceCharAt = function(index, replacement) {
  return this.substr(0, index) + replacement + this.substr(index + replacement.length);
};
var TrieSearch = function(keyFields, options) {
  this.options = options || {};
  this.options.ignoreCase = this.options.ignoreCase === void 0 ? true : this.options.ignoreCase;
  this.options.maxCacheSize = this.options.maxCacheSize || MAX_CACHE_SIZE;
  this.options.cache = this.options.hasOwnProperty("cache") ? this.options.cache : true;
  this.options.splitOnRegEx = this.options.hasOwnProperty("splitOnRegEx") ? this.options.splitOnRegEx : /\s/g;
  this.options.splitOnGetRegEx = this.options.hasOwnProperty("splitOnGetRegEx") ? this.options.splitOnGetRegEx : this.options.splitOnRegEx;
  this.options.min = this.options.min || 1;
  this.options.keepAll = this.options.hasOwnProperty("keepAll") ? this.options.keepAll : false;
  this.options.keepAllKey = this.options.hasOwnProperty("keepAllKey") ? this.options.keepAllKey : "id";
  this.options.idFieldOrFunction = this.options.hasOwnProperty("idFieldOrFunction") ? this.options.idFieldOrFunction : void 0;
  this.options.expandRegexes = this.options.expandRegexes || DEFAULT_INTERNATIONALIZE_EXPAND_REGEXES;
  this.options.insertFullUnsplitKey = this.options.hasOwnProperty("insertFullUnsplitKey") ? this.options.insertFullUnsplitKey : false;
  this.keyFields = keyFields ? keyFields instanceof Array ? keyFields : [keyFields] : [];
  this.root = {};
  this.size = 0;
  if (this.options.cache) {
    this.getCache = new HashArray("key");
  }
};
function deepLookup(obj, keys) {
  return keys.length === 1 ? obj[keys[0]] : deepLookup(obj[keys[0]], keys.slice(1, keys.length));
}
TrieSearch.prototype = {
  add: function(obj, customKeys) {
    if (this.options.cache)
      this.clearCache();
    if (typeof customKeys === "number") {
      customKeys = void 0;
    }
    var keyFields = customKeys || this.keyFields;
    for (var k in keyFields) {
      var key = keyFields[k], isKeyArr = key instanceof Array, val = isKeyArr ? deepLookup(obj, key) : obj[key];
      if (!val)
        continue;
      val = val.toString();
      var expandedValues = this.expandString(val);
      for (var v = 0; v < expandedValues.length; v++) {
        var expandedValue = expandedValues[v];
        this.map(expandedValue, obj);
      }
    }
  },
  expandString: function(value) {
    var values = [value];
    if (this.options.expandRegexes && this.options.expandRegexes.length) {
      for (var i = 0; i < this.options.expandRegexes.length; i++) {
        var er = this.options.expandRegexes[i];
        var match;
        while ((match = er.regex.exec(value)) !== null) {
          var alternateValue = value.replaceCharAt(match.index, er.alternate);
          values.push(alternateValue);
        }
      }
    }
    return values;
  },
  addAll: function(arr, customKeys) {
    for (var i = 0; i < arr.length; i++)
      this.add(arr[i], customKeys);
  },
  reset: function() {
    this.root = {};
    this.size = 0;
  },
  clearCache: function() {
    this.getCache = new HashArray("key");
  },
  cleanCache: function() {
    while (this.getCache.all.length > this.options.maxCacheSize)
      this.getCache.remove(this.getCache.all[0]);
  },
  addFromObject: function(obj, valueField) {
    if (this.options.cache)
      this.clearCache();
    valueField = valueField || "value";
    if (this.keyFields.indexOf("_key_") == -1)
      this.keyFields.push("_key_");
    for (var key in obj) {
      var o = { _key_: key };
      o[valueField] = obj[key];
      this.add(o);
    }
  },
  map: function(key, value) {
    if (this.options.splitOnRegEx && this.options.splitOnRegEx.test(key)) {
      var phrases = key.split(this.options.splitOnRegEx);
      var emptySplitMatch = phrases.filter(function(p) {
        return IS_WHITESPACE.test(p);
      });
      var selfMatch = phrases.filter(function(p) {
        return p === key;
      });
      var selfIsOnlyMatch = selfMatch.length + emptySplitMatch.length === phrases.length;
      if (!selfIsOnlyMatch) {
        for (var i = 0, l = phrases.length; i < l; i++) {
          if (!IS_WHITESPACE.test(phrases[i])) {
            this.map(phrases[i], value);
          }
        }
        if (!this.options.insertFullUnsplitKey) {
          return;
        }
      }
    }
    if (this.options.cache)
      this.clearCache();
    if (this.options.keepAll) {
      this.indexed = this.indexed || new HashArray([this.options.keepAllKey]);
      this.indexed.add(value);
    }
    if (this.options.ignoreCase) {
      key = key.toLowerCase();
    }
    var keyArr = this.keyToArr(key), self = this;
    insert(keyArr, value, this.root);
    function insert(keyArr2, value2, node) {
      if (keyArr2.length == 0) {
        node["value"] = node["value"] || [];
        node["value"].push(value2);
        return;
      }
      var k = keyArr2.shift();
      if (!node[k])
        self.size++;
      node[k] = node[k] || {};
      insert(keyArr2, value2, node[k]);
    }
  },
  keyToArr: function(key) {
    var keyArr;
    if (this.options.min && this.options.min > 1) {
      if (key.length < this.options.min)
        return [];
      keyArr = [key.substr(0, this.options.min)];
      keyArr = keyArr.concat(key.substr(this.options.min).split(""));
    } else
      keyArr = key.split("");
    return keyArr;
  },
  findNode: function(key) {
    return f(this.keyToArr(key), this.root);
    function f(keyArr, node) {
      if (!node)
        return void 0;
      if (keyArr.length == 0)
        return node;
      var k = keyArr.shift();
      return f(keyArr, node[k]);
    }
  },
  _getCacheKey: function(phrase, limit) {
    var cacheKey = phrase;
    if (limit) {
      cacheKey = phrase + "_" + limit;
    }
    return cacheKey;
  },
  _get: function(phrase, limit) {
    phrase = this.options.ignoreCase ? phrase.toLowerCase() : phrase;
    var c, node;
    if (this.options.cache && (c = this.getCache.get(this._getCacheKey(phrase, limit))))
      return c.value;
    var ret = void 0, haKeyFields = this.options.indexField ? [this.options.indexField] : this.keyFields, words = this.options.splitOnGetRegEx ? phrase.split(this.options.splitOnGetRegEx) : [phrase];
    for (var w = 0, l = words.length; w < l; w++) {
      if (this.options.min && words[w].length < this.options.min)
        continue;
      var temp = new HashArray(haKeyFields);
      if (node = this.findNode(words[w]))
        aggregate(node, temp);
      ret = ret ? ret.intersection(temp) : temp;
    }
    var v = ret ? ret.all : [];
    if (this.options.cache) {
      var cacheKey = this._getCacheKey(phrase, limit);
      this.getCache.add({ key: cacheKey, value: v });
      this.cleanCache();
    }
    return v;
    function aggregate(node2, ha) {
      if (limit && ha.all.length === limit) {
        return;
      }
      if (node2.value && node2.value.length) {
        if (!limit || ha.all.length + node2.value.length < limit) {
          ha.addAll(node2.value);
        } else {
          ha.addAll(node2.value.slice(0, limit - ha.all.length));
          return;
        }
      }
      for (var k in node2) {
        if (limit && ha.all.length === limit) {
          return;
        }
        if (k != "value") {
          aggregate(node2[k], ha);
        }
      }
    }
  },
  get: function(phrases, reducer, limit) {
    var haKeyFields = this.options.indexField ? [this.options.indexField] : this.keyFields, ret = void 0, accumulator = void 0;
    if (reducer && !this.options.idFieldOrFunction) {
      throw new Error("To use the accumulator, you must specify and idFieldOrFunction");
    }
    phrases = phrases instanceof Array ? phrases : [phrases];
    for (var i = 0, l = phrases.length; i < l; i++) {
      var matches = this._get(phrases[i], limit);
      if (reducer) {
        accumulator = reducer(accumulator, phrases[i], matches, this);
      } else {
        ret = ret ? ret.addAll(matches) : new HashArray(haKeyFields).addAll(matches);
      }
    }
    return !reducer ? ret.all : accumulator;
  },
  search: function(phrases, reducer, limit) {
    return this.get(phrases, reducer, limit);
  },
  getId: function(item) {
    return typeof this.options.idFieldOrFunction === "function" ? this.options.idFieldOrFunction(item) : item[this.options.idFieldOrFunction];
  }
};
TrieSearch.UNION_REDUCER = function(accumulator, phrase, matches, trie) {
  if (accumulator === void 0) {
    return matches;
  }
  var map = {}, i, id;
  var maxLength = Math.max(accumulator.length, matches.length);
  var results = [];
  var l = 0;
  for (i = 0; i < maxLength; i++) {
    if (i < accumulator.length) {
      id = trie.getId(accumulator[i]);
      map[id] = map[id] ? map[id] : 0;
      map[id]++;
      if (map[id] === 2) {
        results[l++] = accumulator[i];
      }
    }
    if (i < matches.length) {
      id = trie.getId(matches[i]);
      map[id] = map[id] ? map[id] : 0;
      map[id]++;
      if (map[id] === 2) {
        results[l++] = matches[i];
      }
    }
  }
  return results;
};
TrieSearch$1.exports = TrieSearch;
TrieSearch$1.exports.default = TrieSearch;
var trieSearch = TrieSearch$1.exports;
new trieSearch(void 0, {
  splitOnRegEx: false
});
var VocabularyTagType = /* @__PURE__ */ ((VocabularyTagType2) => {
  VocabularyTagType2["Level"] = "level";
  VocabularyTagType2["Domain"] = "domain";
  return VocabularyTagType2;
})(VocabularyTagType || {});
const VocabularyTags = {
  IELTS: {
    displayName: "IELTS / TOEFL",
    type: "level"
  },
  GRE: {
    displayName: "GRE",
    type: "level"
  },
  CET_4: {
    displayName: "China's College English Test Level 4 / \u5927\u5B66\u82F1\u8BED\u56DB\u7EA7",
    type: "level"
  },
  CET_6: {
    displayName: "China's College English Test Level 6 / \u5927\u5B66\u82F1\u8BED\u516D\u7EA7",
    type: "level"
  },
  TEM: {
    displayName: "China's Test for English Majors / \u82F1\u8BED\u4E13\u4E1A\u56DB\u516B\u7EA7",
    type: "level"
  },
  PNEE: {
    displayName: "China's Postgraduate National Entrance Examination / \u8003\u7814\u82F1\u8BED",
    type: "level"
  },
  ACADEMIC: {
    displayName: "Academic",
    type: "domain"
  },
  LEGAL: {
    displayName: "Legal",
    type: "domain"
  },
  BUSINESS: {
    displayName: "Business",
    type: "domain"
  }
};
var SettingsPage_vue_vue_type_style_index_0_scoped_true_lang = "";
const _withScopeId = (n) => (pushScopeId("data-v-38deaa40"), n = n(), popScopeId(), n);
const _hoisted_1 = {
  class: "q-pa-md",
  style: { "min-width": "400px" }
};
const _hoisted_2 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("p", { class: "text-caption" }, "Feel free to contact me at vuyuxl199199@gmail.com", -1));
const _hoisted_3 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("div", { class: "text-divider" }, "Language Setting", -1));
const _hoisted_4 = {
  key: 0,
  class: "col-12 text-h5"
};
const _hoisted_5 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("div", { class: "col-6" }, "Your native language", -1));
const _hoisted_6 = { class: "col-md-auto" };
const _hoisted_7 = { class: "row q-gutter-md" };
const _hoisted_8 = { class: "col-6" };
const _hoisted_9 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("p", null, "I'm preparing for the test:", -1));
const _hoisted_10 = {
  key: 0,
  class: "text-caption"
};
const _hoisted_11 = { class: "col-md-auto" };
const _hoisted_12 = { class: "row q-gutter-md" };
const _hoisted_13 = { class: "col-6" };
const _hoisted_14 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("p", null, "I want to focus on vocabulary related to:", -1));
const _hoisted_15 = {
  key: 0,
  class: "text-caption"
};
const _hoisted_16 = { class: "col-md-auto" };
const _hoisted_17 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("div", { class: "text-divider" }, "General Settings For All Practices", -1));
const _hoisted_18 = { class: "row q-gutter-md" };
const _hoisted_19 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("div", { class: "col-6" }, [
  /* @__PURE__ */ createBaseVNode("p", null, "Proportion of sentences to be practiced (0 ~ 1)"),
  /* @__PURE__ */ createBaseVNode("p", { class: "text-caption" }, " On average, a sentence consists of approximately 2 subtitles. Enter 1 here to practice every sentence. ")
], -1));
const _hoisted_20 = { class: "col-md-auto" };
const _hoisted_21 = { class: "row q-gutter-md" };
const _hoisted_22 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("div", { class: "col-6" }, "Do not blank out names of people, places and organizations", -1));
const _hoisted_23 = { class: "col-md-auto" };
const _hoisted_24 = { class: "row q-gutter-md" };
const _hoisted_25 = { class: "col" };
const _hoisted_26 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("div", { class: "row q-gutter-md" }, [
  /* @__PURE__ */ createBaseVNode("p", { class: "text-h6" }, " Note: you must turn on at least one of the following exercise modes ")
], -1));
const _hoisted_27 = { class: "row q-gutter-md" };
const _hoisted_28 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("div", { class: "col-6" }, "Fill-in-the-blank exercises", -1));
const _hoisted_29 = { class: "col-md-auto" };
const _hoisted_30 = { class: "row q-gutter-md" };
const _hoisted_31 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("div", { class: "col-6" }, "Dictation exercises", -1));
const _hoisted_32 = { class: "col-md-auto" };
const _hoisted_33 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("div", { class: "text-divider" }, "Specific Settings For Each Practice", -1));
const _hoisted_34 = { class: "row q-gutter-md" };
const _hoisted_35 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("div", { class: "col-6" }, "Ratio of fill-in-the-blank to dictation exercises (0.1 ~ 10)", -1));
const _hoisted_36 = { class: "col-md-auto" };
const _hoisted_37 = { class: "row q-gutter-md" };
const _hoisted_38 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("div", { class: "col-6" }, [
  /* @__PURE__ */ createBaseVNode("p", null, "Maximum word limit for dictation sentences")
], -1));
const _hoisted_39 = { class: "col-md-auto" };
const _hoisted_40 = { class: "row q-gutter-md" };
const _hoisted_41 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("div", { class: "col-6" }, [
  /* @__PURE__ */ createBaseVNode("p", null, "Maximum word limit for fill-in-the-blank sentences")
], -1));
const _hoisted_42 = { class: "col-md-auto" };
const _hoisted_43 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("div", { class: "text-divider" }, "Function Settings", -1));
const _hoisted_44 = { class: "row q-gutter-md" };
const _hoisted_45 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("div", { class: "col-6" }, "Show practice review button on video platforms", -1));
const _hoisted_46 = { class: "col-md-auto" };
const _sfc_main = defineComponent({
  __name: "SettingsPage",
  setup(__props) {
    const $q = useQuasar();
    const isSaving = ref(false);
    const config = ref();
    const languageOptions = ref(
      LanguageManager.listLanguageInfo().map((info) => {
        return {
          label: info[1],
          value: info[0]
        };
      })
    );
    const englishLevelTest = ref("");
    const englishLevelTestOptions = [{ label: "Not preparing for any test", value: "" }].concat(
      Object.entries(VocabularyTags).filter(([testName, testInfo]) => testInfo.type === VocabularyTagType.Level).map(([testName, testInfo]) => {
        return { label: testInfo.displayName, value: testName };
      })
    );
    const preferredEnglishDomains = ref([""]);
    const preferredEnglishDomainOptions = [{ label: "No preference", value: "" }].concat(
      Object.entries(VocabularyTags).filter(([domainName, domainInfo]) => domainInfo.type === VocabularyTagType.Domain).map(([domainName, domainInfo]) => {
        return { label: domainInfo.displayName, value: domainName };
      })
    );
    let normalizedBlankOutRatioNum;
    let normalizedDictationRatioNum;
    onBeforeMount(async () => {
      config.value = await getConfig(true);
      normalizePracticeRatio(config.value.blankOutToDictateRatio);
      setVocabularyModels(config.value.preferredVocabularyTags);
    });
    function setVocabularyModels(tags) {
      const allDomainTags = Object.entries(VocabularyTags).filter(([_, tag]) => tag.type === VocabularyTagType.Domain).map(([tagName, _]) => tagName);
      const allLevelTags = Object.entries(VocabularyTags).filter(([_, tag]) => tag.type === VocabularyTagType.Level).map(([tagName, _]) => tagName);
      const preferredDomainTags = tags.filter((tag) => allDomainTags.includes(tag));
      const preferredLevelTags = tags.filter((tag) => allLevelTags.includes(tag));
      preferredEnglishDomains.value = preferredDomainTags.length > 0 ? preferredDomainTags : [""];
      if (preferredLevelTags.length > 0) {
        englishLevelTest.value = preferredLevelTags[0];
      }
    }
    async function onSave() {
      isSaving.value = true;
      config.value.blankOutToDictateRatio = parseFloat(
        (normalizedBlankOutRatioNum / normalizedDictationRatioNum).toFixed(1)
      );
      config.value.preferredVocabularyTags = preferredEnglishDomains.value.concat(englishLevelTest.value).filter((d) => d.length > 0);
      const success = await updateConfig(config.value);
      if (success) {
        $q.notify({
          message: "Saved successfully",
          type: "positive",
          actions: [{ icon: "close", color: "white", round: true }]
        });
      } else {
        $q.notify({
          message: "Failed to save",
          type: "negative",
          actions: [{ icon: "close", color: "white", round: true }]
        });
      }
      isSaving.value = false;
    }
    async function onReset() {
      config.value = initConfig();
      $q.notify({
        message: 'Click "SAVE" button to save the changes or close the window to discard the changes',
        type: "info",
        actions: [{ icon: "close", color: "white", round: true }]
      });
    }
    function filterLanguages(val, update) {
      update(() => {
        const needle = val.toLowerCase();
        languageOptions.value = LanguageManager.listLanguageInfo().map((info) => {
          return {
            label: info[1],
            value: info[0]
          };
        }).filter((info) => info.label.toLowerCase().indexOf(needle) > -1);
      });
    }
    function normalizePracticeRatio(ratio) {
      let isFloat = false;
      if (typeof ratio === "string") {
        if (ratio.includes(".")) {
          ratio = parseFloat(ratio);
          isFloat = true;
        } else {
          ratio = parseInt(ratio);
        }
      } else {
        isFloat = ratio % 1 !== 0;
      }
      if (isFloat) {
        if (ratio > 1) {
          normalizedBlankOutRatioNum = Math.floor(ratio);
          normalizedDictationRatioNum = 1;
        } else {
          normalizedBlankOutRatioNum = Math.floor(ratio * 10);
          normalizedDictationRatioNum = 10;
        }
      } else {
        normalizedBlankOutRatioNum = ratio;
        normalizedDictationRatioNum = 1;
      }
    }
    function updatePreferredEnglishDomain() {
      if (preferredEnglishDomains.value[preferredEnglishDomains.value.length - 1] === "") {
        preferredEnglishDomains.value = [""];
        return;
      }
      if (preferredEnglishDomains.value.length > 1) {
        preferredEnglishDomains.value = preferredEnglishDomains.value.filter((d) => d.length > 0);
        return;
      }
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        _hoisted_2,
        config.value ? (openBlock(), createBlock(QForm, {
          key: 0,
          class: "q-gutter-md text-body1",
          onSubmit: onSave,
          onReset
        }, {
          default: withCtx(() => [
            _hoisted_3,
            createBaseVNode("div", {
              class: normalizeClass(["row", "q-gutter-md", config.value.nativeLanguage === "en" ? "bg-warning" : ""])
            }, [
              config.value.nativeLanguage === "en" ? (openBlock(), createElementBlock("div", _hoisted_4, " Set your native language to non-english. ")) : createCommentVNode("", true),
              _hoisted_5,
              createBaseVNode("div", _hoisted_6, [
                createVNode(QSelect, {
                  outlined: "",
                  modelValue: config.value.nativeLanguage,
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => config.value.nativeLanguage = $event),
                  "use-input": "",
                  "hide-selected": "",
                  "fill-input": "",
                  "emit-value": "",
                  "map-options": "",
                  "input-debounce": "0",
                  options: languageOptions.value,
                  onFilter: filterLanguages,
                  "lazy-rules": "",
                  rules: [
                    (val) => val && val.length > 0 && unref(LanguageManager).isValidLanguageCode(val) || "Please select a language"
                  ]
                }, null, 8, ["modelValue", "options", "rules"])
              ])
            ], 2),
            createBaseVNode("div", _hoisted_7, [
              createBaseVNode("div", _hoisted_8, [
                _hoisted_9,
                englishLevelTest.value.length > 0 ? (openBlock(), createElementBlock("p", _hoisted_10, " Subtitles using words commonly found in " + toDisplayString(unref(VocabularyTags)[englishLevelTest.value].displayName) + " are prioritized for practice. ", 1)) : createCommentVNode("", true)
              ]),
              createBaseVNode("div", _hoisted_11, [
                createVNode(QSelect, {
                  outlined: "",
                  modelValue: englishLevelTest.value,
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => englishLevelTest.value = $event),
                  "emit-value": "",
                  "map-options": "",
                  options: unref(englishLevelTestOptions)
                }, null, 8, ["modelValue", "options"])
              ])
            ]),
            createBaseVNode("div", _hoisted_12, [
              createBaseVNode("div", _hoisted_13, [
                _hoisted_14,
                preferredEnglishDomains.value.filter((d) => d.length > 0).length > 0 ? (openBlock(), createElementBlock("p", _hoisted_15, " Subtitles using common " + toDisplayString(preferredEnglishDomains.value.filter((d) => d.length > 0).map((d) => unref(VocabularyTags)[d].displayName.toLowerCase()).join(", ")) + " words are prioritized for practice. ", 1)) : createCommentVNode("", true)
              ]),
              createBaseVNode("div", _hoisted_16, [
                createVNode(QSelect, {
                  outlined: "",
                  modelValue: preferredEnglishDomains.value,
                  "onUpdate:modelValue": [
                    _cache[2] || (_cache[2] = ($event) => preferredEnglishDomains.value = $event),
                    updatePreferredEnglishDomain
                  ],
                  "emit-value": "",
                  "map-options": "",
                  options: unref(preferredEnglishDomainOptions),
                  multiple: "",
                  "use-chips": "",
                  "stack-label": ""
                }, null, 8, ["modelValue", "options"])
              ])
            ]),
            _hoisted_17,
            createBaseVNode("div", _hoisted_18, [
              _hoisted_19,
              createBaseVNode("div", _hoisted_20, [
                createVNode(QInput, {
                  outlined: "",
                  type: "text",
                  mask: "#.#",
                  modelValue: config.value.proportionOfPractices,
                  "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => config.value.proportionOfPractices = $event),
                  modelModifiers: { number: true },
                  "lazy-rules": "",
                  rules: [
                    (val) => val !== null && val !== "" || "Field cannot be empty",
                    (val) => parseFloat(val) > 0 && parseFloat(val) <= 1 || "The number must be between 0 and 1"
                  ]
                }, null, 8, ["modelValue", "rules"])
              ])
            ]),
            createBaseVNode("div", _hoisted_21, [
              _hoisted_22,
              createBaseVNode("div", _hoisted_23, [
                createVNode(QToggle, {
                  modelValue: config.value.keepNerInPractices,
                  "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => config.value.keepNerInPractices = $event)
                }, null, 8, ["modelValue"])
              ])
            ]),
            createBaseVNode("div", _hoisted_24, [
              createBaseVNode("div", _hoisted_25, [
                _hoisted_26,
                createBaseVNode("div", _hoisted_27, [
                  _hoisted_28,
                  createBaseVNode("div", _hoisted_29, [
                    createVNode(QToggle, {
                      modelValue: config.value.blankOutSentences,
                      "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => config.value.blankOutSentences = $event),
                      disable: !config.value.dictateSentences
                    }, null, 8, ["modelValue", "disable"])
                  ])
                ]),
                createBaseVNode("div", _hoisted_30, [
                  _hoisted_31,
                  createBaseVNode("div", _hoisted_32, [
                    createVNode(QToggle, {
                      modelValue: config.value.dictateSentences,
                      "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => config.value.dictateSentences = $event),
                      disable: !config.value.blankOutSentences
                    }, null, 8, ["modelValue", "disable"])
                  ])
                ])
              ])
            ]),
            _hoisted_33,
            createBaseVNode("div", _hoisted_34, [
              _hoisted_35,
              createBaseVNode("div", _hoisted_36, [
                withDirectives(createVNode(QInput, {
                  outlined: "",
                  modelValue: config.value.blankOutToDictateRatio,
                  "onUpdate:modelValue": [
                    _cache[7] || (_cache[7] = ($event) => config.value.blankOutToDictateRatio = $event),
                    normalizePracticeRatio
                  ],
                  suffix: ": 1",
                  hint: `${unref(normalizedBlankOutRatioNum)} fill-in-the-blank exercise${unref(normalizedBlankOutRatioNum) === 1 ? "" : "s"} for every ${unref(normalizedDictationRatioNum) === 1 ? "" : unref(normalizedDictationRatioNum) + " "}dictation exercise${unref(normalizedDictationRatioNum) === 1 ? "" : "s"}`,
                  "lazy-rules": "",
                  rules: [
                    (val) => val !== null && val !== "" || "Field cannot be empty",
                    (val) => /^\d+(\.\d+)?$/.test(val) && val >= 0.1 && val <= 10 || "The number must be between 0.1 and 10"
                  ]
                }, null, 8, ["modelValue", "hint", "rules"]), [
                  [vShow, config.value.blankOutSentences && config.value.dictateSentences]
                ])
              ])
            ]),
            createBaseVNode("div", _hoisted_37, [
              _hoisted_38,
              createBaseVNode("div", _hoisted_39, [
                withDirectives(createVNode(QInput, {
                  modelValue: config.value.maximumWordLimitForDictation,
                  "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => config.value.maximumWordLimitForDictation = $event),
                  outlined: "",
                  hint: "0 for no limit",
                  type: "number",
                  "lazy-rules": "",
                  rules: [
                    (val) => val !== null && val !== "" || "Field cannot be empty",
                    (val) => val >= 0 || "The number must be an integer >= 0"
                  ]
                }, null, 8, ["modelValue", "rules"]), [
                  [vShow, config.value.dictateSentences]
                ])
              ])
            ]),
            createBaseVNode("div", _hoisted_40, [
              _hoisted_41,
              createBaseVNode("div", _hoisted_42, [
                withDirectives(createVNode(QInput, {
                  modelValue: config.value.maximumWordLimitForBlankOut,
                  "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => config.value.maximumWordLimitForBlankOut = $event),
                  outlined: "",
                  type: "number",
                  hint: "0 for no limit",
                  "lazy-rules": "",
                  rules: [
                    (val) => val !== null && val !== "" || "Field cannot be empty",
                    (val) => val >= 0 || "The number must be an integer >= 0"
                  ]
                }, null, 8, ["modelValue", "rules"]), [
                  [vShow, config.value.blankOutSentences]
                ])
              ])
            ]),
            _hoisted_43,
            createBaseVNode("div", _hoisted_44, [
              _hoisted_45,
              createBaseVNode("div", _hoisted_46, [
                createVNode(QToggle, {
                  modelValue: config.value.showReviewButton,
                  "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => config.value.showReviewButton = $event)
                }, null, 8, ["modelValue"])
              ])
            ]),
            createBaseVNode("div", null, [
              createVNode(QBtn, {
                label: "Save",
                type: "submit",
                color: "primary",
                loading: isSaving.value
              }, null, 8, ["loading"]),
              createVNode(QBtn, {
                label: "Reset",
                type: "reset",
                color: "primary",
                flat: "",
                class: "q-ml-sm"
              })
            ])
          ]),
          _: 1
        })) : createCommentVNode("", true)
      ]);
    };
  }
});
var SettingsPage = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-38deaa40"]]);
export { SettingsPage as default };
