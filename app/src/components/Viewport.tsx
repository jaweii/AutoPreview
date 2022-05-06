import React, { createRef, HTMLAttributes, useEffect, useState } from "react";
import { observer } from "mobx-react";
import { FC } from "react";
import cdp from "../store/cdp";
import { useRef } from "react";
import { useSize } from "ahooks";
import { runInAction, when } from "mobx";
import Canvas from "./Canvas";
import ws from "../store/ws";
import classNames from "classnames";

interface Props extends HTMLAttributes<HTMLDivElement> {}

const ViewPort: FC<Props> = ({ className, ...rest }) => {
  const containerRef = useRef<HTMLDivElement>();
  const size = useSize(containerRef);

  useEffect(() => {
    runInAction(async () => {
      const { width, height } = containerRef.current.getBoundingClientRect();
      Object.assign(cdp.viewport, { width, height });
      if (!ws.ws) {
        return;
      }
      await ws.send("Page.setDeviceMetricsOverride", {
        width: Math.floor(width),
        height: Math.floor(height),
        deviceScaleFactor: devicePixelRatio,
        mobile: false,
        // screenWidth: Math.floor(width * devicePixelRatio),
        // screenHeight: Math.floor(height * devicePixelRatio),
      });
      await cdp.restartCasting();
    });
  }, [size]);

  return (
    <div
      ref={containerRef}
      className={classNames("w-full h-full overflow-hidden", className)}
      {...rest}
    >
      <Canvas />
    </div>
  );
};

export default observer(ViewPort);
