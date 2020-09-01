import * as React from "react";
import * as ReactDOM from "react-dom";
import TabNode from "./model/TabNode";


/** @hidden @internal */
export function showPopup(layoutDiv: HTMLDivElement,
                            triggerElement: Element,
                          items: { index: number, node: TabNode, name: string }[],
                          onSelect: (item: { index: number, node: TabNode, name: string }) => void,
                          classNameMapper: (defaultClassName: string) => string) {

    const currentDocument = triggerElement.ownerDocument;
    const triggerRect = triggerElement.getBoundingClientRect();
    const layoutRect = layoutDiv.getBoundingClientRect();                    

    const elm = currentDocument.createElement("div");
    elm.className = classNameMapper("flexlayout__popup_menu_container");
    if (triggerRect.left < layoutRect.left + layoutRect.width / 2) {
        elm.style.left =  (triggerRect.left - layoutRect.left) + "px";
    } else {
        elm.style.right = (layoutRect.right - triggerRect.right) + "px";
    }

    if (triggerRect.top < layoutRect.top + layoutRect.height / 2) {
        elm.style.top = (triggerRect.top - layoutRect.top) + "px";
    } else {
        elm.style.bottom = (layoutRect.bottom - triggerRect.bottom) + "px";
    }
    layoutDiv.appendChild(elm);

    const onHide = () => {
        ReactDOM.unmountComponentAtNode(elm);
        layoutDiv.removeChild(elm);
    };

    ReactDOM.render(<PopupMenu currentDocument={currentDocument} onSelect={onSelect} onHide={onHide} items={items}
                               classNameMapper={classNameMapper}/>, elm);
}

/** @hidden @internal */
interface IPopupMenuProps {
    items: { index: number, node: TabNode, name: string }[];
    currentDocument: Document;
    onHide: () => void;
    onSelect: (item: { index: number, node: TabNode, name: string }) => void;
    classNameMapper: (defaultClassName: string) => string;
}

/** @hidden @internal */
const PopupMenu = (props: IPopupMenuProps) => {
    const {currentDocument, items, onHide, onSelect, classNameMapper} = props;
    const hidden = React.useRef<boolean>(false);

    React.useEffect(() => {
        currentDocument.addEventListener("mouseup", onDocMouseUp);
        return () => {
            currentDocument.removeEventListener("mouseup", onDocMouseUp);
        };
    }, []);

    const onDocMouseUp = (event: Event) => {
        setTimeout(() => {
            hide();
        }, 0);
    };

    const hide = () => {
        if (!hidden.current) {
            onHide();
            hidden.current = true;
        }
    };

    const onItemClick = (item: { index: number, node: TabNode, name: string }, event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        onSelect(item);
        hide();
        event.stopPropagation();
    };

    const itemElements = items.map(item => <div key={item.index}
                                                className={classNameMapper("flexlayout__popup_menu_item")}
                                                onClick={(event) => onItemClick(item, event)}>{item.name}</div>);

    return <div className={classNameMapper("flexlayout__popup_menu")}>
        {itemElements}
    </div>;
};

