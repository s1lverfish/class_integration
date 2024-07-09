import { Excalidraw } from "@excalidraw/excalidraw";
import { NonDeletedExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import { AppState, BinaryFiles, ExcalidrawImperativeAPI, Gesture } from "@excalidraw/excalidraw/types/types";
import React from "react";
import ReactDOM from "react-dom/client";

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
      ></Excalidraw>
    );
  }
}

export default class ExcalidrawObject{ 
  private initialData : {elements: NonDeletedExcalidrawElement[], files: BinaryFiles} | null;
  private root;
  public appRef : React.RefObject<ExcalidrawWrapper>;

  constructor(root : HTMLDivElement, initialData: {elements: NonDeletedExcalidrawElement[], files: BinaryFiles} | null) {
    this.appRef = React.createRef<ExcalidrawWrapper>();
    this.initialData = initialData;
    this.root = ReactDOM.createRoot(root);
    console.log(root);
    console.log("constructor called");
  }

  public openExcalidraw(){
    this.root.render(
      //<div style={{height: "100vh"}}>
        <ExcalidrawWrapper
          initialData={this.initialData}
        ></ExcalidrawWrapper>
      //</div>
    );
  }

  private getApi = () => {
    if(!this.appRef.current){
      console.error("api is null");
      return null;
    }
    return this.appRef.current;
  }
} 

/*
//default test
const root_element = document.getElementById('root') as HTMLDivElement;
if(root_element){
  const ap = new ExcalidrawObject(root_element, null);
  ap.addListener("initialised", (api : ExcalidrawWrapper) => {
    console.log("ExcalidrawObject has been initialised");
    //ap.setFigureText("Fig. 2");
    //ap.createCalloutForPart({partId: "r2bxYAxyOQ", refNum: "108", partName: "fluid inlet"});
  });
  ap.openExcalidraw();
  //@ts-ignore
  window.ap = ap;
}else{
  alert("root element is null")
}

/*
const root_element = document.getElementById('root') as HTMLDivElement;
ReactDOM.createRoot(root_element).render(<Editor />);
*/