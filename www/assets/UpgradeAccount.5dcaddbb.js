import { l as createComponent, m as computed, n as h, p as hSlot, A as getCurrentInstance, a0 as _export_sfc, d as defineComponent, r as ref, s as onMounted, h as openBlock, c as createElementBlock, e as createVNode, f as withCtx, a as createBaseVNode, F as Fragment, g as renderList, aD as normalizeStyle, t as toDisplayString, u as unref, Q as QBtn, w as withDirectives, ai as pushScopeId, aj as popScopeId, a3 as createTextVNode } from "./index.454a89f7.js";
import { u as useDarkProps, a as useDark } from "./use-dark.a20bd128.js";
import { a as QCard, Q as QCardSection } from "./QCard.c4835b97.js";
import { Q as QCardActions, C as ClosePopup } from "./ClosePopup.a4742f02.js";
import { i as useQuasar, Q as QDialog } from "./use-quasar.2220b5e4.js";
import { a as getUserInfo } from "./axios.ead55ef2.js";
import "./use-timeout.a3e918be.js";
const separatorValues = ["horizontal", "vertical", "cell", "none"];
var QMarkupTable = createComponent({
  name: "QMarkupTable",
  props: {
    ...useDarkProps,
    dense: Boolean,
    flat: Boolean,
    bordered: Boolean,
    square: Boolean,
    wrapCells: Boolean,
    separator: {
      type: String,
      default: "horizontal",
      validator: (v) => separatorValues.includes(v)
    }
  },
  setup(props, { slots }) {
    const vm = getCurrentInstance();
    const isDark = useDark(props, vm.proxy.$q);
    const classes = computed(
      () => `q-markup-table q-table__container q-table__card q-table--${props.separator}-separator` + (isDark.value === true ? " q-table--dark q-table__card--dark q-dark" : "") + (props.dense === true ? " q-table--dense" : "") + (props.flat === true ? " q-table--flat" : "") + (props.bordered === true ? " q-table--bordered" : "") + (props.square === true ? " q-table--square" : "") + (props.wrapCells === false ? " q-table--no-wrap" : "")
    );
    return () => h("div", {
      class: classes.value
    }, [
      h("table", { class: "q-table" }, hSlot(slots.default))
    ]);
  }
});
var UpgradeAccount_vue_vue_type_style_index_0_scoped_true_lang = "";
const _withScopeId = (n) => (pushScopeId("data-v-05a07248"), n = n(), popScopeId(), n);
const _hoisted_1 = {
  class: "q-py-md q-mx-md",
  id: "pricing-table-container"
};
const _hoisted_2 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("p", { class: "text-h3 text-center" }, "Upgrade to Premium", -1));
const _hoisted_3 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("thead", null, [
  /* @__PURE__ */ createBaseVNode("tr", null, [
    /* @__PURE__ */ createBaseVNode("th"),
    /* @__PURE__ */ createBaseVNode("th", null, "Basic"),
    /* @__PURE__ */ createBaseVNode("th", null, "Premium")
  ])
], -1));
const _hoisted_4 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("tr", null, [
  /* @__PURE__ */ createBaseVNode("td", { class: "text-left" }, "Price"),
  /* @__PURE__ */ createBaseVNode("td", { class: "text-center" }, [
    /* @__PURE__ */ createBaseVNode("span", { class: "price-amount" }, "Free")
  ]),
  /* @__PURE__ */ createBaseVNode("td", { class: "text-center" }, [
    /* @__PURE__ */ createBaseVNode("span", null, "$ "),
    /* @__PURE__ */ createBaseVNode("span", { class: "price-amount" }, [
      /* @__PURE__ */ createTextVNode("3"),
      /* @__PURE__ */ createBaseVNode("sup", { class: "price-cycle" }, "/month")
    ]),
    /* @__PURE__ */ createBaseVNode("span", { class: "q-mx-lg" }, "or"),
    /* @__PURE__ */ createBaseVNode("span", null, "$ "),
    /* @__PURE__ */ createBaseVNode("span", { class: "price-amount" }, [
      /* @__PURE__ */ createTextVNode("27"),
      /* @__PURE__ */ createBaseVNode("sup", { class: "price-cycle" }, "/year")
    ])
  ])
], -1));
const _hoisted_5 = { class: "text-left" };
const _hoisted_6 = { class: "text-center" };
const _hoisted_7 = { class: "text-center" };
const _hoisted_8 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("td", null, null, -1));
const _hoisted_9 = {
  href: "https://www.buymeacoffee.com/shawnz",
  target: "_blank"
};
const _hoisted_10 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("p", null, "Thank you for considering supporting us.", -1));
const _hoisted_11 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("p", null, " Currently, the features marked by * are not available, so all users are on the Premium plan for free until we introduce these features. ", -1));
const _hoisted_12 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("p", null, " During this time, you can enjoy all the already available Premium plan features at no cost. ", -1));
const _sfc_main = defineComponent({
  __name: "UpgradeAccount",
  setup(__props) {
    useQuasar();
    const showUpgradeDialog = ref(false);
    const userInfo = ref();
    const plans = ["Basic", "Premium"];
    const features = [
      { feature: "All video platforms", Basic: true, Premium: true },
      { feature: "Subtitle translations", Basic: true, Premium: true },
      { feature: "Skip names in practices", Basic: true, Premium: true },
      {
        feature: "Prioritize words of selected tests and vocabularies for practice",
        Basic: true,
        Premium: true
      },
      { feature: "Customizable settings", Basic: true, Premium: true },
      {
        feature: "Intelligent review planning",
        Basic: "Limited to 300 practices",
        Premium: true
      },
      { feature: "Analysis on user answers", Basic: "Limited to 300 analyses", Premium: true }
    ];
    const featuresForDisplay = features.map((f) => {
      let Basic;
      let Premium;
      if (typeof f.Basic === "boolean") {
        Basic = f.Basic ? "\u2705" : "\u274C";
      } else {
        Basic = f.Basic;
      }
      if (typeof f.Premium === "boolean") {
        Premium = f.Premium ? "\u2705" : "\u274C";
      } else {
        Premium = f.Premium;
      }
      const feature = f.feature;
      return { feature, Basic, Premium };
    });
    onMounted(async () => {
      userInfo.value = await getUserInfo();
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        _hoisted_2,
        createVNode(QMarkupTable, {
          separator: "cell",
          flat: "",
          bordered: ""
        }, {
          default: withCtx(() => [
            createBaseVNode("colgroup", null, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(plans.length + 1, (i) => {
                return openBlock(), createElementBlock("col", {
                  key: i,
                  span: "1",
                  style: normalizeStyle(`width: ${i === 1 ? "33" : 67 / plans.length}%`)
                }, null, 4);
              }), 128))
            ]),
            _hoisted_3,
            createBaseVNode("tbody", null, [
              _hoisted_4,
              (openBlock(true), createElementBlock(Fragment, null, renderList(unref(featuresForDisplay), (featureForDisplay) => {
                return openBlock(), createElementBlock("tr", {
                  key: featureForDisplay.feature
                }, [
                  createBaseVNode("td", _hoisted_5, toDisplayString(featureForDisplay.feature), 1),
                  createBaseVNode("td", _hoisted_6, toDisplayString(featureForDisplay.Basic), 1),
                  createBaseVNode("td", _hoisted_7, toDisplayString(featureForDisplay.Premium), 1)
                ]);
              }), 128)),
              createBaseVNode("tr", null, [
                _hoisted_8,
                createBaseVNode("td", null, [
                  createVNode(QBtn, {
                    label: userInfo.value && userInfo.value.isPremium ? "You're already on premium" : "Current",
                    disable: "",
                    rounded: "",
                    unelevated: "",
                    class: "full-width"
                  }, null, 8, ["label"])
                ]),
                createBaseVNode("td", null, [
                  createBaseVNode("a", _hoisted_9, [
                    createVNode(QBtn, {
                      label: "Upgrade",
                      color: "amber",
                      unelevated: "",
                      class: "full-width"
                    })
                  ])
                ])
              ])
            ])
          ]),
          _: 1
        }),
        createVNode(QDialog, {
          modelValue: showUpgradeDialog.value,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => showUpgradeDialog.value = $event)
        }, {
          default: withCtx(() => [
            createVNode(QCard, null, {
              default: withCtx(() => [
                createVNode(QCardSection, { class: "row items-center text-body1" }, {
                  default: withCtx(() => [
                    _hoisted_10,
                    _hoisted_11,
                    _hoisted_12
                  ]),
                  _: 1
                }),
                createVNode(QCardActions, { align: "right" }, {
                  default: withCtx(() => [
                    withDirectives(createVNode(QBtn, {
                      flat: "",
                      label: "Ok",
                      color: "primary"
                    }, null, 512), [
                      [ClosePopup]
                    ])
                  ]),
                  _: 1
                })
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["modelValue"])
      ]);
    };
  }
});
var UpgradeAccount = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-05a07248"]]);
export { UpgradeAccount as default };
