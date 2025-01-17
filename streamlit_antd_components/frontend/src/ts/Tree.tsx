import {Streamlit} from "streamlit-component-lib";
import React, {useEffect, useState} from "react";
import type {TreeProps} from 'antd/es/tree';
import {Tree, ConfigProvider} from 'antd';
import {CaretDownFilled} from '@ant-design/icons';
import {strToNode, treeHeight} from "../js/tree.react";
import {
    AlphaColor,
    reindex,
    getCollapseKeys,
    getParentKeys,
    StreamlitScrollbar,
    LabelComponent,
} from "../js/utils.react"
import '../css/tree.css'

interface TreeProp {
    label: any
    items: any[]
    index: any
    icon: any
    height: any
    open_index: any
    open_all: boolean
    checkbox: boolean
    checkbox_strict: boolean
    show_line: boolean
    return_index: boolean;
    kv: any;
}

const AntdTree = (props: TreeProp) => {
    //get data
    const label = props['label']
    const items = strToNode(props['items']);
    const dsk = reindex(props['index'], false)
    let dok = reindex(props['open_index'], false)
    const openAll = props['open_all']
    const icon = props['icon']
    const height = props['height']
    const checkable = props['checkbox']
    const checkStrictly = props['checkbox_strict']
    const showLine = props['show_line']
    const return_index = props['return_index']
    const kv = props['kv']
    dok = openAll ? getCollapseKeys(items) : dok ? dok : dsk && getParentKeys(dsk, items)

    //state
    const [value, setValue] = useState(dsk)
    const labelHeight = label !== null ? 31 : 0
    const [autoHeight, setAutoHeight] = useState(treeHeight(dok, items) + labelHeight)

    // component height
    useEffect(() => Streamlit.setFrameHeight(height != null ? height + labelHeight : autoHeight))

    //scrollbar
    StreamlitScrollbar()

    //callback
    const onExpand: TreeProps['onExpand'] = (e) => {
        //update component height
        setAutoHeight(treeHeight(e, items) + labelHeight)
    };
    const onSelect: TreeProps['onSelect'] = (selectedKeys_, info) => {
        setValue(selectedKeys_)
        Streamlit.setComponentValue(selectedKeys_.map((x: any) => return_index ? x : kv[x]));
    };
    const onCheck: TreeProps['onCheck'] = (checkedKeys_, info) => {
        let ck = (Array.isArray(checkedKeys_)) ? checkedKeys_ : checkedKeys_['checked']
        setValue(ck)
        Streamlit.setComponentValue(ck.map((x: any) => return_index ? x : kv[x]))
    }

    return (
        <ConfigProvider
            theme={{
                components: {
                    Tree: {
                        colorPrimary: 'var(--primary-color)',
                        colorPrimaryHover: 'var(--primary-color)',
                        colorBgContainer: 'transform',
                        colorText: 'var(--text-color)',
                        colorTextDisabled: AlphaColor('--text-color', 0.5),
                        controlItemBgHover: AlphaColor('--text-color', 0.1),
                        controlItemBgActive: AlphaColor(),
                        fontSize: 14,
                        fontFamily: 'var(--font)',
                        colorBorder: AlphaColor('--text-color', 0.3),
                    },
                },
            }}
        >
            <LabelComponent
                label={label}
                onlyLabel={true}
                children={
                    <Tree
                        onSelect={onSelect}
                        onCheck={onCheck}
                        onExpand={onExpand}
                        selectedKeys={value}
                        checkedKeys={value}
                        defaultSelectedKeys={dsk}
                        defaultCheckedKeys={dsk}
                        defaultExpandedKeys={dok}
                        treeData={items}
                        showLine={showLine}
                        checkable={checkable}
                        selectable={!checkable}
                        height={height}
                        checkStrictly={checkStrictly}
                        switcherIcon={<CaretDownFilled/>}
                        showIcon={true}
                        icon={icon && <i className={`bi bi-${icon}`}/>}
                        virtual={false}
                        style={{
                            whiteSpace: 'nowrap', overflowX: 'auto', overflowY: 'hidden'
                        }}
                    />
                }
            />
        </ConfigProvider>
    );
};

export default AntdTree
