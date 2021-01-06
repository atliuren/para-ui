import React, {FunctionComponent} from "react";
import Quill from "quill";
import {ParaUIStyleProvider, whiteTheme} from "../providers";
import {ThemeProvider} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

export {
    ParaEditor
};

interface ParaEditorProps {
    theme?: "snow"
    value?: string;
    onChange?: Function;
    maxLength?: number;
    toolbar?: any[]
}

const toolbarOptions = [
    ["bold", "italic", "underline", "strike"],        // toggled buttons
    ["blockquote", "code-block"],

    [{"header": 1}, {"header": 2}],               // custom button values
    [{"list": "ordered"}, {"list": "bullet"}],
    [{"script": "sub"}, {"script": "super"}],      // superscript/subscript
    [{"indent": "-1"}, {"indent": "+1"}],          // outdent/indent
    [{"direction": "rtl"}],                         // text direction

    [{"size": ["small", false, "large", "huge"]}],  // custom dropdown
    [{"header": [1, 2, 3, 4, 5, 6, false]}],

    [{"color": []}, {"background": []}],          // dropdown with defaults from theme
    [{"font": []}],
    [{"align": []}],

    ["link", "image"],

    ["clean"]                                         // remove formatting button
];

const EditorDOM = React.forwardRef((props: any, ref: any) => (
    <div ref={ref} className="editor">
        {props.children}
    </div>
));

const ParaEditor: FunctionComponent<ParaEditorProps> = (props) => {
    let {
        value = "",
        theme = "snow",
        onChange = () => {
        },
        maxLength,
        toolbar = toolbarOptions
    } = props;
    const ref = React.createRef();
    const [val, setVal] = React.useState(value);
    const [open, setOpen] = React.useState(false);
    const [newDOM, setNewDOM] = React.useState<any>(null);
    const [URLValue, setURLValue] = React.useState<any>(null);
    const [state, setState] = React.useState<any>({
        error: false,
        helpText: ""
    });

    const handleClose = () => {
        setOpen(false);
        setURLValue(null);
        setState({error: false, helpText: ""});
    };
    const insertImagePosition = () => {
        if (!URLValue) {
            setState({error: true, helpText: "请输入地址"});
        } else {
            // 当编辑器中没有输入文本时，这里获取到的 range 为 null
            const range = newDOM.selection.savedRange.index;
            // 视频插入在富文本中的位置
            let index: number;
            if (range == null) {
                index = 0;
            } else {
                index = range;
            }
            // 隐藏弹框
            setOpen(false);
            // 将视频链接插入到当前的富文本当中
            newDOM.insertEmbed(index, "image", URLValue);
            newDOM.setSelection(index + 1, 0);
            setURLValue(null); // 清空值
        }
    };

    const setTextFiledValue = (event: any) => {
        const value = event.target.value as string;
        if (value) {
            setState({error: false, helpText: ""});
        }
        setURLValue(value);
    };

    React.useEffect(() => {
        if (ref.current) {
            const node: any = ref.current;
            const quill: any = new Quill(node, {
                theme: theme,
                modules: {
                    toolbar: {
                        container: toolbar, // 工具栏
                        handlers: {
                            "image": function (value: any) {
                                if (value) {
                                    setOpen(true);
                                } else {
                                    newDOM.format("image", false);
                                }
                            }
                        }
                    }
                }
            });
            setNewDOM((prevState: any) => {
                prevState = quill;
                if (value) {
                    quill.root.innerHTML = value;
                }
                quill.on("editor-change", function (eventName: any) {
                    if (eventName === "text-change") {
                        const textLen = quill.getLength();
                        if (maxLength && textLen > maxLength) {
                            quill.deleteText(maxLength, textLen - maxLength);
                        }
                        setVal((origin: any) => {
                            origin = quill.container.firstChild.innerHTML;
                            if (onChange) onChange(origin, val);
                            return origin;
                        });
                    }
                });
                return prevState;
            });
        }
    }, [ref.current]);

    return (
        <ThemeProvider theme={whiteTheme}>
            <ParaUIStyleProvider prefix={"para-ui-editor"}>
                <div className={"paraEditor"}>
                    <EditorDOM ref={ref}/>
                </div>
                <Dialog open={open} onClose={handleClose} aria-labelledby="edit-dialog-title">
                    <DialogTitle id="edit-dialog-title">插入图片地址</DialogTitle>
                    <DialogContent>
                        <TextField autoFocus
                                   margin="dense"
                                   label="图片地址"
                                   fullWidth
                                   required
                                   error={state.error}
                                   helperText={state.helpText}
                                   onChange={setTextFiledValue}/>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">取消</Button>
                        <Button onClick={insertImagePosition} color="primary">确定</Button>
                    </DialogActions>
                </Dialog>
            </ParaUIStyleProvider>
        </ThemeProvider>
    );
};
export default ParaEditor;
