/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

export function AutoPreview_Button_List() {
  return (
    <autopreview-list>
      <a-button type="primary">Primary Button</a-button>
      <a-button>Default Button</a-button>
      <a-button type="dashed">Dashed Button</a-button>
      <a-button type="text">Text Button</a-button>
      <a-button type="link">Link Button</a-button>
      <a-button type="primary" ghost>
        Primary
      </a-button>
      <a-button ghost>Default</a-button>
      <a-button type="dashed" ghost>
        Dashed
      </a-button>
      <a-button danger ghost>
        Danger
      </a-button>
      <a-button type="link" ghost>
        Link
      </a-button>

      <a-button type="primary" danger>
        Primary
      </a-button>
      <a-button danger>Default</a-button>
      <a-button type="dashed" danger>
        Dashed
      </a-button>
      <a-button type="text" danger>
        Text
      </a-button>
      <a-button type="link" danger>
        Link
      </a-button>
    </autopreview-list>
  );
}

export function AutoPreview_Button() {
  let i = 0;
  return (
    <a-button
      type="primary"
      onClick={() => {
        console.log("打印到OUTPUT面板", { i: i++ });
      }}
    >
      console.log
    </a-button>
  );
}
