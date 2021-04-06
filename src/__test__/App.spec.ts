import {render} from "@testing-library/vue";
import App from "../App.vue";

describe('name check app', function () {
  it('should show placeholder', function () {
    const { getByPlaceholderText} = render(App);
    getByPlaceholderText('spotter...');
  });
});
