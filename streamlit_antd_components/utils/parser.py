#!/usr/bin/env python
# _*_coding:utf-8_*_

"""
@Time     : 2023/6/6 10:13
@Author   : ji hao ran
@File     : parser.py
@Project  : StreamlitAntdComponents
@Software : PyCharm
"""

from typing import List, Union, Callable, Any

__all__ = ['update_kw', 'get_default', 'ParseItems']


def update_kw(kw: dict, items=None):
    r = kw.copy()
    if items is not None:
        r.update(items=items)
    delete_keys = ['format_func', 'key', 'on_change', 'arg', 'kwargs']
    for k in delete_keys:
        if k in r.keys():
            del r[k]
    return r


def get_default(index, return_index, kv):
    if return_index:
        return index
    else:
        if isinstance(index, int):
            return kv.get(index)
        if isinstance(index, list):
            return [kv.get(i) for i in index]
        if index is None:
            return None


class ParseItems:

    def __init__(self, items: List[Union[str, dict, Any]], format_func: Union[str, Callable] = None):
        """

        :param items: component items data
        :param format_func: format component item label func
        """
        self.items = items if items is not None else []
        self.format_func = format_func

    def _label_format(self, label: str):
        if self.format_func is not None:
            if self.format_func == 'title':
                return str.title(label)
            elif self.format_func == 'upper':
                return str.upper(label)
            elif isinstance(self.format_func, Callable):
                return self.format_func(label)
        else:
            return label

    def transfer(self):
        r, kv = [], {}
        for idx, v in enumerate(self.items):
            item = {'title': v}
            item.update(key=idx)  # add key
            item.update(titleFormatter=self._label_format(v))
            r.append(item)
            kv.update({idx: v})
        return r, kv

    @staticmethod
    def _item_to_dict(item, field: str = 'label'):
        if isinstance(item, str):
            return {field: item}
        elif isinstance(item, dict):
            return item.copy()
        else:
            return item.__dict__.copy()

    def single(self, key_field: str = 'key', label_field: str = 'label', key_as_str: bool = False):
        """parse single level component items data"""
        r, kv = [], {}
        for idx, v in enumerate(self.items):
            item = self._item_to_dict(v, label_field)
            label = item.get(label_field)
            item.update({key_field: str(idx) if key_as_str else idx})  # add key
            item.update({label_field: self._label_format(label)})
            r.append(item)
            kv.update({idx: label})
        return r, kv

    def multi(self, field: str = 'key'):
        """parse multiple levels component items data"""
        key, kv0 = 0, []

        def _add_key(items):
            r1 = []
            nonlocal key
            for i in items:
                item = self._item_to_dict(i)
                kv0.append(item.get('label'))
                children = item.get('children')
                item.update({field: key})  # add field
                key += 1
                item.update(label=self._label_format(item.get('label')))
                if children:
                    item.update(children=_add_key(children))
                r1.append(item)
            return r1

        r = _add_key(self.items)
        kv = {idx: v for idx, v in enumerate(kv0)}
        return r, kv
