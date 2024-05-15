import flatpickr from "flatpickr";
import { Spanish } from "flatpickr/dist/l10n/es.js";
import "flatpickr/dist/flatpickr.min.css";

const datePicker = {
  mounted: (el, binding) => {
    flatpickr(el, {
      enableTime: false,
      dateFormat: "Y-m-d",
      locale: Spanish,
      onChange: (selectedDates) => {
        binding.value = selectedDates[0];
      },
    });
  },
};

export default datePicker;