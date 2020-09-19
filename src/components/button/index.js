

import React, { Component } from 'react';
import { useEffect, useState } from "react";

/**
 * 简易Button组件(用于一些自定义组件使用，脱离ui库的依赖)
 */
const Button = (props) => {
    return (
        <button>
            {props.icon || null}
        </button>
    );
};

export default Button;
