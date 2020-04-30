interface GLMatrixFloat32Array<T extends number> extends Float32Array { 
	length: T;
}

export type Vec2 = GLMatrixFloat32Array<2>;
export type Vec3 = GLMatrixFloat32Array<3>;
export type Vec4 = GLMatrixFloat32Array<4>;
export type Mat4 = GLMatrixFloat32Array<16>;
export type Mat3 = GLMatrixFloat32Array<9>;
export type Mat2d = GLMatrixFloat32Array<6>;
export type Mat2 = GLMatrixFloat32Array<4>;
export type Quat = GLMatrixFloat32Array<4>;
export type Quat2 = GLMatrixFloat32Array<8>;