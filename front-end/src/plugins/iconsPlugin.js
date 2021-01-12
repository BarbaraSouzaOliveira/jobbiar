
import {DollarSignIcon, CreditCardIcon, ClipboardIcon, PlusIcon, SlidersIcon, UsersIcon, CameraIcon, MapPinIcon, SettingsIcon, MenuIcon, UserIcon, ArrowLeftIcon, ChevronRightIcon, ChevronUpIcon, ChevronDownIcon, BarChart2Icon, CheckIcon, FileTextIcon, LogInIcon, LogOutIcon, XIcon, Trash2Icon, AwardIcon, CheckCircleIcon, EyeIcon, XCircleIcon, BriefcaseIcon, HomeIcon, MoreHorizontalIcon } from 'vue-feather-icons'

const DashboardIcon = {
  name: 'DashboardIcon',
  functional: true,
  render: function render(h, ctx) {
    return h("svg", {
      attrs: {
        xmlns: "http://www.w3.org/2000/svg",
        width: "24",
        height: "24",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        stroke: "none",
        "stroke-width": "2",
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
      },
      ...ctx.data,
    }, [h("path", {
      attrs: {
        d: "M12.984 3h8.016v6h-8.016v-6zM12.984 21v-9.984h8.016v9.984h-8.016zM3 21v-6h8.016v6h-8.016zM3 12.984v-9.984h8.016v9.984h-8.016z",
      },
    })]);
  }
};

const EditIcon = {
  name: 'EditIcon',
  functional: true,
  render: function render(h, ctx) {
    return h("svg", {
      attrs: {
        xmlns: "http://www.w3.org/2000/svg",
        width: "24",
        height: "24",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        stroke: "none",
        "stroke-width": "2",
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
      },
      ...ctx.data,
    }, [h("path", {
      attrs: {
        d: "M21.7 7.3l-5-5c-0.4-0.4-1-0.4-1.4 0l-13 13c-0.2 0.2-0.3 0.4-0.3 0.7v5c0 0.6 0.4 1 1 1h5c0.3 0 0.5-0.1 0.7-0.3l13-13c0.4-0.4 0.4-1 0-1.4zM7.6 20h-3.6v-3.6l12-12 3.6 3.6-12 12z",
      },
    })]);
  }
};

const SearchIcon = {
  name: 'SearchIcon',
  functional: true,
  render: function render(h, ctx) {
    return h("svg", {
      attrs: {
        xmlns: "http://www.w3.org/2000/svg",
        width: "24",
        height: "24",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        stroke: "none",
        "stroke-width": "2",
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
      },
      ...ctx.data,
    }, [h("path", {
      attrs: {
        d: "M9.516 14.016c2.484 0 4.5-2.016 4.5-4.5s-2.016-4.5-4.5-4.5-4.5 2.016-4.5 4.5 2.016 4.5 4.5 4.5zM15.516 14.016l4.969 4.969-1.5 1.5-4.969-4.969v-0.797l-0.281-0.281c-1.125 0.984-2.625 1.547-4.219 1.547-3.609 0-6.516-2.859-6.516-6.469s2.906-6.516 6.516-6.516 6.469 2.906 6.469 6.516c0 1.594-0.563 3.094-1.547 4.219l0.281 0.281h0.797z",
      },
    })]);
  }
};

const RoomIcon = {
  name: 'RoomIcon',
  functional: true,
  render: function render(h, ctx) {
    return h("svg", {
      attrs: {
        xmlns: "http://www.w3.org/2000/svg",
        width: "24",
        height: "24",
        viewBox: "0 0 492.5 492.5",
        fill: "currentColor",
        stroke: "none",
        "stroke-width": "2",
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
      },
      ...ctx.data,
    }, [h("path", {
      attrs: {
        d: "M184.646,0v21.72H99.704v433.358h31.403V53.123h53.539V492.5l208.15-37.422v-61.235V37.5L184.646,0z M222.938,263.129 c-6.997,0-12.67-7.381-12.67-16.486c0-9.104,5.673-16.485,12.67-16.485s12.67,7.381,12.67,16.485 C235.608,255.748,229.935,263.129,222.938,263.129z",
      },
    })]);
  }
};

const WarehouseIcon = {
  name: 'WarehouseIcon',
  functional: true,
  render: function render(h, ctx) {
    return h("svg", {
      attrs: {
        xmlns: "http://www.w3.org/2000/svg",
        width: "24",
        height: "24",
        viewBox: "0 0 640 512",
        fill: "currentColor",
        stroke: "none",
        "stroke-width": "2",
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
      },
      ...ctx.data,
    }, [h("path", {
      attrs: {
        d: "M504 352H136.4c-4.4 0-8 3.6-8 8l-.1 48c0 4.4 3.6 8 8 8H504c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8zm0 96H136.1c-4.4 0-8 3.6-8 8l-.1 48c0 4.4 3.6 8 8 8h368c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8zm0-192H136.6c-4.4 0-8 3.6-8 8l-.1 48c0 4.4 3.6 8 8 8H504c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8zm106.5-139L338.4 3.7a48.15 48.15 0 0 0-36.9 0L29.5 117C11.7 124.5 0 141.9 0 161.3V504c0 4.4 3.6 8 8 8h80c4.4 0 8-3.6 8-8V256c0-17.6 14.6-32 32.6-32h382.8c18 0 32.6 14.4 32.6 32v248c0 4.4 3.6 8 8 8h80c4.4 0 8-3.6 8-8V161.3c0-19.4-11.7-36.8-29.5-44.3z",
      },
    })]);
  }
};


/**
 * @param {import("vue").VueConstructor} Vue
 */
export function install(Vue) {
	if (install.installed) return;
	install.installed = true;

  let icons = [
    DollarSignIcon,
    CreditCardIcon,
    PlusIcon,
    SlidersIcon,
    UsersIcon,
    RoomIcon,
    MoreHorizontalIcon,
    CameraIcon,
    ClipboardIcon,
    MapPinIcon,
    SettingsIcon,
    MenuIcon,
    UserIcon,
    ArrowLeftIcon,
    ChevronRightIcon,
    ChevronUpIcon, 
    ChevronDownIcon,
    BarChart2Icon,
    CheckIcon,
    FileTextIcon,
    LogInIcon,
    LogOutIcon,
    Trash2Icon,
    AwardIcon,
    XIcon,
    CheckCircleIcon,
    EyeIcon,
    XCircleIcon,
    BriefcaseIcon,
    HomeIcon,
    DashboardIcon,
    EditIcon,
    SearchIcon,
    WarehouseIcon,
  ];

  for (let icon of icons) {
    Vue.component(icon.name, icon);
  }
}

export default {
  install,
}
