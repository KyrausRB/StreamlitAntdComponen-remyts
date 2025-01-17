import {Streamlit} from "streamlit-component-lib";
import React, {useEffect} from "react";
import {Tabs, ConfigProvider} from 'antd';
import {strToNode, TabsStyle} from "../js/tabs.react";
import {AlphaColor} from "../js/utils.react"
import '../css/tabs.css'

interface TabsProp {
    items: any[];
    index: string;
    align: string;
    position: any;
    shape: any;
    centered: boolean;
    height: number | null;
    grow: boolean;
    return_index: boolean;
    kv: any;
}

const AntdTabs = (props: TabsProp) => {
    //get data
    const items = strToNode(props['items'])
    const index = props['index']
    const align = props['align']
    const position = props['position']
    const shape = props['shape']
    const centered = props['centered']
    const height = props['height']
    const grow = props['grow']
    const return_index = props['return_index']
    const kv = props['kv']

    // load style
    TabsStyle(align, grow)

    //component height
    let tabsHeight = ['left', 'right'].includes(position) && height != null ? height : undefined

    // set component height
    useEffect(() => Streamlit.setFrameHeight(tabsHeight))

    //callback
    const onClick = (key: string) => {
        Streamlit.setComponentValue(return_index ? key : kv[key])
    }

    return (
        <ConfigProvider
            theme={{
                components: {
                    Tabs: {
                        itemActiveColor: 'var(--primary-color)',
                        itemHoverColor: 'var(--primary-color)',
                        itemSelectedColor: 'var(--primary-color)',
                        inkBarColor: 'var(--primary-color)',
                        colorBgContainer: AlphaColor('--primary-color', 0.2),
                        colorText: 'var(--text-color)',
                        colorTextDisabled: AlphaColor('--text-color', 0.5),
                        colorPrimary: 'var(--primary-color)',
                        colorBgContainerDisabled: 'transform',
                        fontSize: 14,
                        fontFamily: 'var(--font)',
                        cardBg: AlphaColor('--text-color', 0.1),
                        cardGutter: 2,
                        horizontalItemGutter: 15,
                        horizontalMargin: '0',
                        colorBorderSecondary: 'transform',
                    },
                },
            }}
        >
            <Tabs
                items={items}
                defaultActiveKey={index}
                onTabClick={onClick}
                type={shape === 'default' ? 'line' : shape}
                tabPosition={position}
                centered={centered}
                style={{height: tabsHeight}}
            />
        </ConfigProvider>
    );
};

export default AntdTabs
