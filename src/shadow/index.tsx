import React, {FunctionComponent, ChangeEvent} from "react";
import ColorizeSharp from "@material-ui/icons/ColorizeSharp";
import IconButton from "@material-ui/core/IconButton";
import Popover from "@material-ui/core/Popover";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Slider from "@material-ui/core/Slider";
import {ChromePicker} from "react-color";
import Lang from "./language";
import {ParaUIStyleProvider, whiteTheme} from "../providers";
import {ThemeProvider} from "@material-ui/core/styles";

interface ParaShadowProps {
    width?: number;
    height?: number;
    value?: string | null; // ['insert,0,0,0,0,'#ffffff']
    onChange?: Function;
    language?: "en" | "zh-CN"
}

export {
    ParaShadow,
    ParaShadowProps
};
const CanvasDOM = React.forwardRef((props: any, ref: any) => {
    return (
        <div className={"canvas-box"}>
            <canvas {...props} ref={ref}/>
        </div>
    );
});

export interface initValueProps {
    type?: "inset" | "outset";
    xOffset?: number;
    yOffset?: number;
    blur?: number | number[];
    spread?: number | number[];
    color?: string;
}

const getNumber = (val: any) => {
    val = val?.match(/([0-9]*)(px|$)/);
    if (!val || !val[1]) return 0;
    return Number(val[1]);
};

const ParaShadow: FunctionComponent<ParaShadowProps> = (props) => {
    let {
        width = 80,
        height = 80,
        value,
        language = "zh-CN",
        onChange = () => {
        }
    } = props;
    /* 判断入参的格式 */
    let INIT_VALUE: initValueProps = {
        type: "outset",
        xOffset: 0,
        yOffset: 0,
        blur: 0,
        spread: 0,
        color: "#cccccc",
    };
    /* 设置默认语言 */
    let INIT_LANG: any = {};
    if (language === "en") {
        INIT_LANG = Lang.en;
    } else {
        INIT_LANG = Lang.cn;
    }
    if (value) {
        let val: any = value || "";
        try {
            const isInset = /^inset\s/.test(value);
            if (isInset) {
                val = val.match(/^inset\s(.*)/)[1];
                INIT_VALUE.type = "inset";
            }
            let arr = val.split(" ");
            INIT_VALUE.color = arr.pop();
            INIT_VALUE.xOffset = getNumber(arr[0]);
            INIT_VALUE.yOffset = getNumber(arr[1]);
            INIT_VALUE.blur = getNumber(arr[2]);
            if (arr[3]) INIT_VALUE.spread = getNumber(arr[3]);
        } catch (e) {
            throw Error("数据格式有误");
        }
    }

    const ref = React.createRef();
    const [colorEl, setColorEl] = React.useState<HTMLButtonElement | null>(null);
    const [type, setType] = React.useState<string | undefined>(INIT_VALUE.type);
    const [xOffset, setXoffset] = React.useState<number | undefined>(INIT_VALUE.xOffset);
    const [yOffset, setYoffset] = React.useState<number | undefined>(INIT_VALUE.yOffset);
    const [blur, setBlur] = React.useState<number | number[] | undefined>(INIT_VALUE.blur);
    const [spread, setSpread] = React.useState<number | number[] | undefined>(INIT_VALUE.spread);
    const [color, setColor] = React.useState<string | undefined>(INIT_VALUE.color);
    const openColor = Boolean(colorEl);

    const handleColorClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setColorEl(event.currentTarget);
    };
    const handleColorClose = () => {
        setColorEl(null);
    };
    const changeXYOffset = (x: number, y: number) => {
        setXoffset(x);
        setYoffset(y);
    };
    const drawPaint = (node: any) => {
        const canvas: any = node.current;
        let down = false;
        const context = canvas.getContext("2d");
        const tops: any = canvas.getBoundingClientRect().y;
        const left: any = canvas.getBoundingClientRect().x;
        const ball = { //圆形
            x: 40, //初始位置x
            y: 40, //初始位置y
            vx: 1, //x方向移动速率
            vy: 1, //y方向移动速率
            radius: 10, //圆形半径
            color: "#1976d2", //圆形颜色
            draw: function () {
                context.beginPath();
                context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, true);
                context.closePath();
                context.fillStyle = ball.color;
                context.fill();
            }
        };

        const line = {
            x: 40,
            y: 40,
            ex: 40,
            ey: 40,
            color: "#1976d2",
            draw: function () {
                context.beginPath();
                context.lineCap = "round";
                context.moveTo(line.x, line.y);
                context.lineTo(line.ex, line.ey);
                context.stroke();
            }
        };

        const clear = () => {
            context.fillStyle = "rgba(255,255,255)";
            context.fillRect(0, 0, canvas.width, canvas.height);
        };

        const draw = () => {
            clear();
            ball.x += ball.vx;
            ball.y += ball.vy;
            // 边界
            if (ball.y + ball.vy > canvas.height || ball.y + ball.vy < 0) {
                ball.vy = -ball.vy;
            }
            if (ball.x + ball.vx > canvas.width || ball.x + ball.vx < 0) {
                ball.vx = -ball.vx;
            }

            window.requestAnimationFrame(draw); // 控制动画
        };

        canvas.addEventListener("mousedown", function (e: any) {
            if ((e.clientX - left) > (ball.x - ball.radius) && (e.clientX - left) < (ball.x + ball.radius) && (e.clientY -
                tops) > (ball.y - ball.radius) &&
                (e.clientY - tops) < (ball.y + ball.radius)) {
                down = true;
            }
        });

        canvas.addEventListener("mouseup", function () {
            down = false;
        });

        canvas.addEventListener("mousemove", function (e: any) {
            if (down) {
                clear();
                ball.x = e.clientX - left;
                ball.y = e.clientY - tops;
                line.ex = ball.x;
                line.ey = ball.y;
                ball.draw();
                line.draw();
                changeXYOffset(parseInt((ball.x * 0.5 - 20) + "", 10), parseInt((ball.y * 0.5 - 20) + "", 10));
            }
        });

        ball.draw();
        line.draw();
    };

    const sequlizeFunc = () => {
        let boxShadow: string = "";
        if (type === "inset") {
            boxShadow = `${type} ${xOffset}px ${yOffset}px ${blur}px ${spread}px ${color}`;
        } else {
            boxShadow = `${xOffset}px ${yOffset}px ${blur}px ${spread}px ${color}`;
        }
        return boxShadow;
    };

    React.useEffect(() => {
        /* 绘制canvas #1976d2 */
        if (ref.current) {
            drawPaint(ref);
        }
        return () => {
        };
    }, [ref.current, open]);

    React.useEffect(() => {
        if (onChange) {
            onChange(sequlizeFunc());
        }
    }, [xOffset, yOffset, type, blur, spread, color]);
    return (
        <ThemeProvider theme={whiteTheme}>
            <ParaUIStyleProvider prefix={"para-shadow-provider"}>
                <div className={"paraShadow"}>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <Typography variant="body2" align={"center"} gutterBottom>
                                {INIT_LANG.type}
                            </Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <ButtonGroup size="small" variant="contained">
                                <Button
                                    color={type === "outset" ? "primary" : "default"}
                                    disableElevation
                                    onClick={() => setType("outset")}
                                >Outset</Button>
                                <Button color={type === "inset" ? "primary" : "default"}
                                        disableElevation
                                        onClick={() => setType("inset")}
                                >Inset</Button>
                            </ButtonGroup>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={8}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="body2" align={"center"}
                                                gutterBottom>{INIT_LANG.xOffset}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField size={"small"}
                                               label="px"
                                               variant="outlined"
                                               value={xOffset}
                                               onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                                                   setXoffset(Number(event.target.value))}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="body2" align={"center"} gutterBottom>{
                                        INIT_LANG.yOffset
                                    }</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField size={"small"} label="px" variant="outlined"
                                               value={yOffset}
                                               onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                                                   setYoffset(Number(event.target.value))}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={4}>
                            <CanvasDOM ref={ref} width={width} height={height}/>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <Typography variant="body2" align={"center"} gutterBottom>{INIT_LANG.blur}</Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <TextField size={"small"} label="px" variant="outlined" value={blur}
                                       onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                                           setBlur(Number(event.target.value))}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <Slider value={blur} min={0} max={20}
                                    onChange={(_: any, val: number | number[]) => setBlur(val)}/>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <Typography variant="body2" align={"center"} gutterBottom>{
                                INIT_LANG.spread
                            }</Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <TextField size={"small"} label="px" variant="outlined"
                                       value={spread}
                                       onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                                           setSpread(Number(event.target.value))}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <Slider value={spread}
                                    min={0}
                                    max={20}
                                    onChange={(_: any, val: number | number[]) => {
                                        setSpread(val);
                                    }}/>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <Typography variant="body2" align={"center"} gutterBottom>{INIT_LANG.color}</Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <TextField size={"small"} label="hex" variant="outlined"
                                       onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                                           setColor(event.target.value)}
                                       value={color}/>
                        </Grid>
                        <Grid item xs={4}>
                            <IconButton onClick={handleColorClick} size={"small"}>
                                <ColorizeSharp/>
                            </IconButton>
                            <Popover
                                open={openColor}
                                anchorEl={colorEl}
                                onClose={handleColorClose}
                                anchorOrigin={{vertical: "bottom", horizontal: "center",}}
                                transformOrigin={{vertical: "top", horizontal: "center",}}
                            >
                                <ChromePicker
                                    color={color}
                                    onChange={(cl: any) => {
                                        setColor(cl.hex);
                                    }}
                                />
                            </Popover>
                        </Grid>
                    </Grid>
                </div>
            </ParaUIStyleProvider>
        </ThemeProvider>
    );
};

export default ParaShadow;
