import React, { useRef, useEffect, useState } from "react";
import "./calculator.css";
import { btns, BTN_ACTIONS } from "./btnConfig";

const Calculator = () => {
    // useRef trả về object có key current
    const btnsRef = useRef(null);
    const expRef = useRef(null);

    const [calculator, setCalculator] = useState("");
    // useEffect(() => {
    //     console.log(expRef.current);
    // });
    // offsetWidth and offsetHeight trong JavaScript lấy kích thước pixel của phần tử HTML. Tính bằng cách sử dụng kích thước của nội dung bên trong phần tử HTML bao gôm cả padding, borders, scrollbars k tính margin
    // btnsRef.current = div calculator__btns có tất cả phần tử con đã render
    // btnsRef.current.querySelectorAll("button")) lấy tất cả div btn

    useEffect(() => {
        // Array.from convert về array
        const btns = Array.from(btnsRef.current.querySelectorAll("button"));
        btns.forEach((e) => (e.style.height = e.offsetWidth - 50 + "px"));
    }, []);

    const btnClick = (item) => {
        // Click lấy ra object ứng với button trong file btnConfig
        const expDiv = expRef.current;
        // expDiv = <div ref={expRef} className="calculator__result__exp"></div>
        if (item.action === BTN_ACTIONS.THEME)
            document.body.classList.toggle("dark");
        if (item.action === BTN_ACTIONS.ADD) {
            addAnimaSpan(item.display);

            const oper = item.display !== "x" ? item.display : "*";
            setCalculator(calculator + oper);
        }
        if (item.action === BTN_ACTIONS.DELETE) {
            expDiv.parentNode.querySelector("div:last-child").innerHTML = "";
            expDiv.innerHTML = "";

            setCalculator("");
        }
        if (item.action === BTN_ACTIONS.CALC) {
            if (calculator.trim().length <= 0) return;
            expDiv.parentNode.querySelector("div:last-child").remove();

            const cloneNode = expDiv.cloneNode(true);
            expDiv.parentNode.appendChild(cloneNode);

            const transform = `translateY(${
                -(expDiv.offsetHeight + 10) + "px"
            })scale(0.4)`;

            try {
                let res = eval(calculator);

                setCalculator(res.toString());
                setTimeout(() => {
                    cloneNode.style.transform = transform;
                    expDiv.innerHTML = "";
                    addAnimaSpan(Math.floor(res * 100000000) / 100000000);
                }, 200);
            } catch {
                setTimeout(() => {
                    cloneNode.style.transform = transform;
                    expDiv.innerHTML = "Syntax err";
                }, 200);
            } finally {
                console.log("calc complete");
            }
        }
    };

    const addAnimaSpan = (display) => {
        // Tạo tag span đưa display vào
        const expDiv = expRef.current;
        const span = document.createElement("span");

        // Đưa span có opa=0 vào làm thẻ con của <div ref={expRef} className="calculator__result__exp"></div>

        span.innerHTML = display;
        span.style.opacity = "0";
        // span.style.opacity = "1";
        expDiv.appendChild(span);

        // Click sẽ tạo span và đưa vào width=0 lưu width của span trước đó vào width
        const width = span.offsetWidth + "px";
        span.style.width = "0";
        // span.style.width = width;

        setTimeout(() => {
            span.style.opacity = "1";
            span.style.width = width;
        }, 100);
    };

    return (
        <div className="calculator">
            <div className="calculator__result">
                <div ref={expRef} className="calculator__result__exp"></div>
                <div className="calculator__result__exp"></div>
            </div>
            <div ref={btnsRef} className="calculator__btns">
                {btns.map((item, index) => (
                    <button
                        className={item.class}
                        key={index}
                        onClick={() => btnClick(item)}
                    >
                        {item.display}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Calculator;
