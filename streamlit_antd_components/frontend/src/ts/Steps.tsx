import {Streamlit} from "streamlit-component-lib";
import React, {useEffect, useState} from "react";
import {Steps, ConfigProvider} from 'antd';
import {AlphaColor} from "../js/utils.react";
import {strToNode} from "../js/steps.react";
import "../css/steps.css"

interface StepsProp {
    items: any[];
    index: number;
    size: "default" | "small";
    placement: any;
    direction: any;
    type: any;
    dot: boolean;
    return_index: boolean;
    kv: any;
}

const AntdSteps = (props: StepsProp) => {
    //get data
    const items = strToNode(props['items'])
    const index = props['index']
    const size = props['size']
    const placement = props['placement']
    const direction = props['direction']
    const type = props['type']
    const dot = props['dot']
    const return_index = props['return_index']
    const kv = props['kv']

    // component height
    useEffect(() => {
        setTimeout(() => Streamlit.setFrameHeight(), 0.01)
    })

    const [current, setCurrent] = useState(index)

    //callback
    const onChange = (current: any) => {
        setCurrent(current)
        Streamlit.setComponentValue(return_index ? current : kv[current])
    }

    return (
        <ConfigProvider
            theme={{
                components: {
                    Steps: {
                        colorFillContent: AlphaColor('--text-color', 0.1),
                        colorPrimary: 'var(--primary-color)',
                        colorText: 'var(--text-color)',
                        colorTextLabel: AlphaColor('--text-color', 0.5),
                        colorTextDescription: AlphaColor('--text-color', 0.5),
                        colorTextDisabled: AlphaColor('--text-color', 0.2),
                        controlItemBgActive: AlphaColor(),
                        colorSplit: AlphaColor('--text-color', 0.2),
                        navArrowColor: AlphaColor('--text-color', 0.5),
                    },
                },
            }}
        >
            <Steps
                items={items}
                current={current}
                direction={direction}
                labelPlacement={placement}
                size={size}
                type={type}
                progressDot={dot}
                onChange={onChange}
            />
        </ConfigProvider>
    );
};

export default AntdSteps
