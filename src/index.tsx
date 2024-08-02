import React from "react";
import ReactDOM from "react-dom/client";
import {
  Excalidraw,
  exportSticker as exportStickerExcalidraw,
} from "excalidraw-bumperactive";
import {
  ExcalidrawImperativeAPI,
  AppState,
  BinaryFiles,
  Gesture,
} from "excalidraw-bumperactive/dist/excalidraw/types";
import { NonDeletedExcalidrawElement } from "excalidraw-bumperactive/dist/excalidraw/element/types";

export type AppProps = {
  initialData: {
    appState?: Partial<AppState>;
    elements?: NonDeletedExcalidrawElement[];
    files?: BinaryFiles;
  } | null;
};

interface State {
  excalidrawAPI: ExcalidrawImperativeAPI | null; //api to talk with excalidraw
}

export class ExcalidrawWrapper extends React.Component<AppProps, State> {
  private initialised: boolean; //did component initialise?

  public pointerData: {
    pointer: { x: number; y: number };
    button: "down" | "up";
    pointersMap: Gesture["pointers"];
  } | null; //pointer data, causes componentDidUpdate to be called on pointer move

  constructor(props: AppProps) {
    super(props);
    this.state = {
      excalidrawAPI: null,
    };
    this.initialised = false;
    this.pointerData = null;
  }

  componentWillMount(): void {
    console.log("component will mount");
  }

  componentWillUnmount(): void {
    console.log("component will unmount");
  }

  //called when state changes (onPointerUpdate and more)
  componentDidUpdate(
    prevProps: Readonly<AppProps>,
    prevState: Readonly<State>,
    snapshot?: any,
  ): void {
    console.log("component did update");
    if (
      this.state.excalidrawAPI !== prevState.excalidrawAPI &&
      this.state.excalidrawAPI
    ) {
      //@ts-ignore
      window.api = this.state.excalidrawAPI;
    }
  }
  render(): JSX.Element {
    return (
      <Excalidraw
        excalidrawAPI={(api: ExcalidrawImperativeAPI) =>
          this.setState({ excalidrawAPI: api })
        }
        onChange={(elements, state) => null}
        onPointerUpdate={(payload: {
          pointer: { x: number; y: number };
          button: "down" | "up";
          pointersMap: Gesture["pointers"];
        }) => {
          this.pointerData = payload;
        }}
        initialData={{
          appState: {
            stickerType: "rectangle",
            scrollX: (window.innerWidth * 0.8) / 2,
            scrollY: window.innerHeight / 2,
          },
        }}
      ></Excalidraw>
    );
  }
}

export default class ExcalidrawObject {
  private root;
  public appRef: React.RefObject<ExcalidrawWrapper>;

  constructor(root: HTMLDivElement) {
    this.root = ReactDOM.createRoot(root);
    this.appRef = React.createRef<ExcalidrawWrapper>();
  }

  public openExcalidraw() {
    this.root.render(
      <ExcalidrawWrapper
        ref={this.appRef}
        initialData={null}
      ></ExcalidrawWrapper>,
    );
  }

  private getExcalidrawApi() {
    return this.appRef.current?.state.excalidrawAPI;
  }

  private extractSceneData(api: ExcalidrawImperativeAPI) {
    return {
      elements: api.getSceneElements(),
      appState: api.getAppState(),
      files: api.getFiles(),
    };
  }

  public changeStickerType(type: "rectangle" | "square" | "circle") {
    const api = this.getExcalidrawApi();
    if (!api) {
      return;
    }
    api.updateScene({ appState: { stickerType: type } });
  }

  public async exportSticker() {
    const api = this.getExcalidrawApi();
    if (!api) {
      return;
    }
    const { elements, appState } = this.extractSceneData(api);

    return await exportStickerExcalidraw(elements, appState);
  }

  public closeExcalidraw() {
    this.root.unmount();
  }
}
