<template>
  <div class="container mt-2">
    <h4 class="text-center">Covid Daily Cases</h4>
    <b-form-select
      v-model="selectedTypeDate"
      :options="typeDate"
    ></b-form-select>
    <div class="d-flex justify-content-center flex-wrap">
      <HistogramSlider
        v-if="selectedTypeDate === 'single'"
        class="m-3"
        :keyboard="true"
        :width="600"
        :bar-height="0"
        :data="allData"
        :prettify="prettify"
        :drag-interval="false"
        :force-edges="false"
        :colors="['#4facfe', '#00f2fe']"
        :min="new Date(2020, 3, 20).valueOf()"
        :max="new Date().valueOf()"
        type="single"
        :key="selectedTypeDate"
        :hideFromTo="false"
        @change="changeDate($event)"
      />

      <HistogramSlider
        v-if="selectedTypeDate === 'double'"
        class="m-3"
        :keyboard="true"
        :width="600"
        :bar-height="0"
        :data="allData"
        :prettify="prettify"
        :drag-interval="false"
        :force-edges="false"
        :colors="['#4facfe', '#00f2fe']"
        :min="new Date(2020, 3, 20).valueOf()"
        :max="new Date().valueOf()"
        type="double"
        :key="selectedTypeDate"
        :hideFromTo="false"
        @change="changeDate($event)"
      />

      <vuevectormap
        ref="map"
        map="world"
        height="650"
        width="100%"
        backgroundColor="#505050"
        :regionsSelectable="true"
        :regionsSelectableOne="true"
        @loaded="loaded"
        @regionTooltipShow="onRegionTooltipShow($event, dateFrom, dateTo)"
      >
      </vuevectormap>
    </div>
  </div>
</template>

<script>
import { supabase } from "../config/client.js";
import moment from "moment";

export default {
  mounted() {
    this.dateFrom = moment(new Date(2020, 3, 20)).format("YYYY-MM-DD");
    this.dateTo = moment(new Date()).format("YYYY-MM-DD");
  },

  data() {
    return {
      test: "",
      allData: [],
      totalDate: 0,
      country: "",
      componentKey: 0,
      selectedDate: [],
      dateFrom: "",
      dateTo: "",
      sumVariants: [],
      selectedTypeDate: "double",
      typeDate: [
        { value: null, text: "Please select an option", disabled: true },
        { value: "single", text: "Data from one date" },
        { value: "double", text: "Data accumulated from period" },
      ],
      prettify: function (ts) {
        return new Date(ts).toLocaleDateString("en", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      },
    };
  },
  methods: {
    async fetchData(event, dateFrom, dateTo) {
      const { data, error } = await supabase
        .from("covid-variants")
        .select()
        .match({ location: event })
        .gte("date", moment(dateFrom).format("YYYY-MM-DD"))
        .lte(
          "date",
          this.selectedTypeDate == "double"
            ? moment(dateTo).format("YYYY-MM-DD")
            : moment(dateFrom).format("YYYY-MM-DD")
        );

      this.allData = data;

      this.sumVariants = this.allData.reduce((acc, cur) => {
        return {
          ...acc,
          [cur.variant]: (acc[cur.variant] || 0) + parseInt(cur.num_sequences),
        };
      }, []);

      this.totalDate = this.allData.reduce((acc, cur) => {
        return cur.variant !== "non_who"
          ? acc + parseInt(cur.num_sequences)
          : acc;
      }, 0);
    },

    onRegionTooltipShow: async function (tooltip, index) {
      const sumVariants = () => {
        return Object.entries(this.sumVariants).map((entry) => {
          return `${entry[0]}: ${entry[1]}\n`;
        });
      };
      await this.fetchData(tooltip.text(), this.dateFrom, this.dateTo);

      tooltip
        .css({
          zIndex: "9999",
          backgroundColor: "white",
          color: "#35373e",
          whiteSpace: "pre",
          display: "block",
          fontSize: "10px",
        })
        .getElement().innerHTML = `${tooltip.text()}\n${sumVariants()}Total:${
        this.totalDate
      }`;
    },

    loaded(map) {
      console.log("loaded");
      window.addEventListener("resize", () => {
        map.updateSize();
      });
    },

    async changeDate(event) {
      console.log(event);
      console.log(this.selectedDate);
      this.dateFrom = moment(event.from_pretty).format("YYYY-MM-DD");
      event.hasOwnProperty("to_pretty")
        ? (this.dateTo = moment(event.to_pretty).format("YYYY-MM-DD"))
        : (this.dateTo = "");
      await this.fetchData(this.country, this.dateFrom, this.dateTo);
    },
  },
};
</script>
