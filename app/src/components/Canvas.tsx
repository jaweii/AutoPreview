import React, { HTMLAttributes, KeyboardEvent, useState } from "react";
import { observer } from "mobx-react";
import { FC } from "react";
import cdp from "../store/cdp";
import { useRef } from "react";
import ws from "../store/ws";

const buttons = { 0: "left", 1: "middle", 2: "right" };

interface Props extends HTMLAttributes<HTMLCanvasElement> {}

const Canvas: FC<Props> = ({}) => {
  const canvasRef = useRef<HTMLCanvasElement>();
  const image = useRef<HTMLImageElement>();

  const [state, setState] = useState({ cursor: "auto" });

  const methods = {
    render() {
      if (!canvasRef.current) {
        return;
      }
      const {
        metadata: { deviceWidth, deviceHeight },
      } = cdp.screencastFrame;
      const ctx = canvasRef.current.getContext("2d");
      ctx.imageSmoothingEnabled = false;
      canvasRef.current.width = cdp.viewport.width * devicePixelRatio;
      canvasRef.current.height = cdp.viewport.height * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
      ctx.drawImage(image.current, 0, 0, deviceWidth, deviceHeight);
    },
    onMouseDown(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
      ws.send("puppeteer", {
        name: "page.mouse.down",
        args: [
          {
            button: buttons[e.button],
            // clickCount: e.detail,
          },
        ],
      });
    },
    onMouseUp(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
      ws.send("puppeteer", {
        name: "page.mouse.up",
        args: [
          {
            button: buttons[e.button],
            // clickCount: e.detail,
          },
        ],
      });
    },
    async onMouseMove(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
      ws.send("puppeteer", {
        name: "page.mouse.move",
        args: [e.clientX, e.clientY],
      });
      const style = await methods.getComputedStyle(
        Math.floor(e.clientX),
        Math.floor(e.clientY)
      );
      setState({ ...state, cursor: style.cursor || state.cursor });
    },
    onContextMenu(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
      e.preventDefault();
      e.stopPropagation();
    },
    onClick(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {},
    onWheel(e: React.WheelEvent<HTMLCanvasElement>) {
      ws.send("Input.dispatchMouseEvent", {
        type: "mouseWheel",
        x: e.pageX,
        y: e.pageY,
        deltaX: e.deltaX,
        deltaY: e.deltaY,
      });
    },
    onKeyDown(e: KeyboardEvent<HTMLCanvasElement>) {
      ws.send("puppeteer", {
        name: "page.keyboard.down",
        args: [
          e.code,
          {
            text: e.key.length === 1 ? e.key : undefined,
          },
        ],
      });
    },
    onKeyUp(e: KeyboardEvent<HTMLCanvasElement>) {
      ws.send("puppeteer", {
        name: "page.keyboard.up",
        args: [e.code],
      });
    },
    onKeyPress(e: KeyboardEvent<HTMLCanvasElement>) {},
    async getComputedStyle(x: number, y: number) {
      const nodeInfo = await ws.send("DOM.getNodeForLocation", { x, y });
      if (!nodeInfo) {
        return {};
      }
      let nodeId: string = nodeInfo.nodeId;
      if (!nodeId) {
        await ws.send("DOM.getDocument");
        let nodeIdsReq = await ws.send("DOM.pushNodesByBackendIdsToFrontend", {
          backendNodeIds: [nodeInfo.backendNodeId],
        });
        nodeId = nodeIdsReq && nodeIdsReq[0];
      }
      const { computedStyle = [] } =
        (await ws.send("CSS.getComputedStyleForNode", {
          nodeId,
        })) || {};
      return computedStyle.reduce((pre, cur, i) => {
        return { ...pre, [cur.name]: cur.value };
      }, {});
    },
  };

  return (
    <>
      <img
        ref={image}
        className="hidden"
        src={"data:image/png;base64," + cdp.screencastFrame.data}
        onLoad={methods.render}
      />
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        onMouseDown={methods.onMouseDown}
        onMouseUp={methods.onMouseUp}
        onMouseMove={methods.onMouseMove}
        onContextMenu={methods.onContextMenu}
        onClick={methods.onClick}
        onWheel={methods.onWheel}
        onKeyDown={methods.onKeyDown}
        onKeyUp={methods.onKeyUp}
        onKeyPress={methods.onKeyPress}
        tabIndex={0}
        style={{
          cursor: state.cursor,
        }}
      />
    </>
  );
};

export default observer(Canvas);
