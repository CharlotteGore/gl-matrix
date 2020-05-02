import * as mat4 from "./mat4"
import * as quat from "./quat"
import * as vec3 from "./vec3"
import { Quat, Vec3, Mat4 } from "./types";
import { EPSILON } from "./common";

expect.extend({
    toBeEqualish(received: Float32Array, expectation: Float32Array) {

        if (received.length != expectation.length)
            return {
                message: () => `expected ${received} to be equal(ish) to ${expectation}`,
                pass: false,
            } 

        for (let i = 0; i < expectation.length; i++) {
            if (Math.abs(received[i] - expectation[i]) >= EPSILON) {
                return {
                    message: () => `expected ${received} to be equal(ish) to ${expectation}`,
                    pass: false
                } 
            }
        }
        return {
            message: () => `expected ${received} to be equal(ish) to ${expectation}`,
            pass: true,
        } 
    },
    toBeNearly(received: number, expectation: number) {
        if (Math.abs(received - expectation) >= EPSILON) {
            return {
                message: () => `expected ${received} to be nearly ${expectation}`,
                pass: false
            } 
        }
        return {
            message: () => `expected ${received} to be nearly ${expectation}`,
            pass: true,
        } 
    },
  });

  declare global {
    namespace jest {
      interface Matchers<R> {
        toBeEqualish(a: Float32Array): R;
        toBeNearly(a: number): R
      }
    }
  }

  function buildMat4Tests() {
    return function() {
        let out: Mat4;
        let v3out: Vec3;
        let matA: Mat4;
        let matB: Mat4;
        let identity: Mat4;
        let result: Mat4;
        let vec3result: Vec3;
        let numResult: number;
        let strResult: string;

        beforeEach(function() {
            // Attempting to portray a semi-realistic transform matrix
            matA = new Float32Array([1, 0, 0, 0,
                                     0, 1, 0, 0,
                                     0, 0, 1, 0,
                                     1, 2, 3, 1]) as Mat4;

            matB = new Float32Array([1, 0, 0, 0,
                                     0, 1, 0, 0,
                                     0, 0, 1, 0,
                                     4, 5, 6, 1]) as Mat4;

            out = new Float32Array([0, 0, 0, 0,
                                    0, 0, 0, 0,
                                    0, 0, 0, 0,
                                    0, 0, 0, 0]) as Mat4;

            identity = new Float32Array([1, 0, 0, 0,
                                         0, 1, 0, 0,
                                         0, 0, 1, 0,
                                         0, 0, 0, 1]) as Mat4;
        });

        describe("create", function() {
            beforeEach(function() { result = mat4.create(); });
            it("should return a 16 element array initialized to a 4x4 identity matrix", function() { expect(result).toBeEqualish(identity); });
        });

        describe("clone", function() {
            beforeEach(function() { result = mat4.clone(matA); });
            it("should return a 16 element array initialized to the values in matA", function() { expect(result).toBeEqualish(matA); });
        });

        describe("copy", function() {
            beforeEach(function() { result = mat4.copy(out, matA); });
            it("should place values into out", function() { expect(out).toBeEqualish(matA); });
            it("should return out", function() { expect(result).toBe(out); });
        });

        describe("identity", function() {
            beforeEach(function() { result = mat4.identity(out); });
            it("should place values into out", function() { expect(result).toBeEqualish(identity); });
            it("should return out", function() { expect(result).toBe(out); });
        });

        describe("transpose", function() {
            describe("with a separate output matrix", function() {
                beforeEach(function() { result = mat4.transpose(out, matA); });

                it("should place values into out", function() {
                    expect(out).toBeEqualish(mat4.fromValues(
                        1, 0, 0, 1,
                        0, 1, 0, 2,
                        0, 0, 1, 3,
                        0, 0, 0, 1
                    ));
                });
                it("should return out", function() { expect(result).toBe(out); });
                it("should not modify matA", function() {
                    expect(matA).toBeEqualish(mat4.fromValues(
                        1, 0, 0, 0,
                        0, 1, 0, 0,
                        0, 0, 1, 0,
                        1, 2, 3, 1
                    ));
                });
            });

            describe("when matA is the output matrix", function() {
                beforeEach(function() { result = mat4.transpose(matA, matA); });

                it("should place values into matA", function() {
                    expect(matA).toBeEqualish(mat4.fromValues(
                        1, 0, 0, 1,
                        0, 1, 0, 2,
                        0, 0, 1, 3,
                        0, 0, 0, 1
                    ));
                });
                it("should return matA", function() { expect(result).toBe(matA); });
            });
        });

        describe("invert", function() {
            describe("with a separate output matrix", function() {
                beforeEach(function() { result = mat4.invert(out, matA); });

                it("should place values into out", function() {
                    expect(out).toBeEqualish(mat4.fromValues(
                        1, 0, 0, 0,
                        0, 1, 0, 0,
                        0, 0, 1, 0,
                        -1, -2, -3, 1
                    ));
                });
                it("should return out", function() { expect(result).toBe(out); });
                it("should not modify matA", function() {
                    expect(matA).toBeEqualish(mat4.fromValues(
                        1, 0, 0, 0,
                        0, 1, 0, 0,
                        0, 0, 1, 0,
                        1, 2, 3, 1
                    ));
                });
            });

            describe("when matA is the output matrix", function() {
                beforeEach(function() { result = mat4.invert(matA, matA); });

                it("should place values into matA", function() {
                    expect(matA).toBeEqualish(mat4.fromValues(
                        1, 0, 0, 0,
                        0, 1, 0, 0,
                        0, 0, 1, 0,
                        -1, -2, -3, 1
                    ));
                });
                it("should return matA", function() { expect(result).toBe(matA); });
            });
        });

        describe("adjoint", function() {
            describe("with a separate output matrix", function() {
                beforeEach(function() { result = mat4.adjoint(out, matA); });

                it("should place values into out", function() {
                    expect(out).toBeEqualish(mat4.fromValues(
                        1, 0, 0, 0,
                        0, 1, 0, 0,
                        0, 0, 1, 0,
                        -1, -2, -3, 1
                    ));
                });
                it("should return out", function() { expect(result).toBe(out); });
                it("should not modify matA", function() {
                    expect(matA).toBeEqualish(mat4.fromValues(
                        1, 0, 0, 0,
                        0, 1, 0, 0,
                        0, 0, 1, 0,
                        1, 2, 3, 1
                    ));
                });
            });

            describe("when matA is the output matrix", function() {
                beforeEach(function() { result = mat4.adjoint(matA, matA); });

                it("should place values into matA", function() {
                    expect(matA).toBeEqualish(mat4.fromValues(
                        1, 0, 0, 0,
                        0, 1, 0, 0,
                        0, 0, 1, 0,
                        -1, -2, -3, 1
                    ));
                });
                it("should return matA", function() { expect(result).toBe(matA); });
            });
        });

        describe("determinant", function() {
            beforeEach(function() { numResult = mat4.determinant(matA); });

            it("should return the determinant", function() { expect(numResult).toEqual(1); });
        });

        describe("multiply", function() {
            it("should have an alias called 'mul'", function() { expect(mat4.mul).toEqual(mat4.multiply); });

            describe("with a separate output matrix", function() {
                beforeEach(function() { result = mat4.multiply(out, matA, matB); });

                it("should place values into out", function() {
                    expect(out).toBeEqualish(mat4.fromValues(
                        1, 0, 0, 0,
                        0, 1, 0, 0,
                        0, 0, 1, 0,
                        5, 7, 9, 1
                    ));
                });
                it("should return out", function() { expect(result).toBe(out); });
                it("should not modify matA", function() {
                    expect(matA).toBeEqualish(mat4.fromValues(
                        1, 0, 0, 0,
                        0, 1, 0, 0,
                        0, 0, 1, 0,
                        1, 2, 3, 1
                    ));
                });
                it("should not modify matB", function() {
                    expect(matB).toBeEqualish(mat4.fromValues(
                        1, 0, 0, 0,
                        0, 1, 0, 0,
                        0, 0, 1, 0,
                        4, 5, 6, 1
                    ));
                });
            });

            describe("when matA is the output matrix", function() {
                beforeEach(function() { result = mat4.multiply(matA, matA, matB); });

                it("should place values into matA", function() {
                    expect(matA).toBeEqualish(mat4.fromValues(
                        1, 0, 0, 0,
                        0, 1, 0, 0,
                        0, 0, 1, 0,
                        5, 7, 9, 1
                    ));
                });
                it("should return matA", function() { expect(result).toBe(matA); });
                it("should not modify matB", function() {
                    expect(matB).toBeEqualish(mat4.fromValues(
                        1, 0, 0, 0,
                        0, 1, 0, 0,
                        0, 0, 1, 0,
                        4, 5, 6, 1
                    ));
                });
            });

            describe("when matB is the output matrix", function() {
                beforeEach(function() { result = mat4.multiply(matB, matA, matB); });

                it("should place values into matB", function() {
                    expect(matB).toBeEqualish(mat4.fromValues(
                        1, 0, 0, 0,
                        0, 1, 0, 0,
                        0, 0, 1, 0,
                        5, 7, 9, 1
                    ));
                });
                it("should return matB", function() { expect(result).toBe(matB); });
                it("should not modify matA", function() {
                    expect(matA).toBeEqualish(mat4.fromValues(
                        1, 0, 0, 0,
                        0, 1, 0, 0,
                        0, 0, 1, 0,
                        1, 2, 3, 1
                    ));
                });
            });
        });

        describe("translate", function() {
            describe("with a separate output matrix", function() {
                beforeEach(function() { result = mat4.translate(out, matA, vec3.fromValues(4, 5, 6)); });

                it("should place values into out", function() {
                    expect(out).toBeEqualish(mat4.fromValues(
                        1, 0, 0, 0,
                        0, 1, 0, 0,
                        0, 0, 1, 0,
                        5, 7, 9, 1
                    ));
                });
                it("should return out", function() { expect(result).toBe(out); });
                it("should not modify matA", function() {
                    expect(matA).toBeEqualish(mat4.fromValues(
                        1, 0, 0, 0,
                        0, 1, 0, 0,
                        0, 0, 1, 0,
                        1, 2, 3, 1
                    ));
                });
            });

            describe("when matA is the output matrix", function() {
                beforeEach(function() { result = mat4.translate(matA, matA, vec3.fromValues(4, 5, 6)); });

                it("should place values into matA", function() {
                    expect(matA).toBeEqualish(mat4.fromValues(
                        1, 0, 0, 0,
                        0, 1, 0, 0,
                        0, 0, 1, 0,
                        5, 7, 9, 1
                    ));
                });
                it("should return matA", function() { expect(result).toBe(matA); });
            });
        });

        describe("scale", function() {
            describe("with a separate output matrix", function() {
                beforeEach(function() { result = mat4.scale(out, matA, vec3.fromValues(4, 5, 6)); });

                it("should place values into out", function() {
                    expect(out).toBeEqualish(mat4.fromValues(
                        4, 0, 0, 0,
                        0, 5, 0, 0,
                        0, 0, 6, 0,
                        1, 2, 3, 1
                    ));
                });
                it("should return out", function() { expect(result).toBe(out); });
                it("should not modify matA", function() {
                    expect(matA).toBeEqualish(mat4.fromValues(
                        1, 0, 0, 0,
                        0, 1, 0, 0,
                        0, 0, 1, 0,
                        1, 2, 3, 1
                    ));
                });
            });

            describe("when matA is the output matrix", function() {
                beforeEach(function() { result = mat4.scale(matA, matA, vec3.fromValues(4, 5, 6)); });

                it("should place values into matA", function() {
                    expect(matA).toBeEqualish(mat4.fromValues(
                        4, 0, 0, 0,
                        0, 5, 0, 0,
                        0, 0, 6, 0,
                        1, 2, 3, 1
                    ));
                });
                it("should return matA", function() { expect(result).toBe(matA); });
            });
        });

        describe("rotate", function() {
            let rad = Math.PI * 0.5;
            let axis = vec3.fromValues(1, 0, 0);

            describe("with a separate output matrix", function() {
                beforeEach(function() { result = mat4.rotate(out, matA, rad, axis); });

                it("should place values into out", function() {
                    expect(out).toBeEqualish(mat4.fromValues(
                        1, 0, 0, 0,
                        0, Math.cos(rad), Math.sin(rad), 0,
                        0, -Math.sin(rad), Math.cos(rad), 0,
                        1, 2, 3, 1
                    ));
                });
                it("should return out", function() { expect(result).toBe(out); });
                it("should not modify matA", function() {
                    expect(matA).toBeEqualish(mat4.fromValues(
                        1, 0, 0, 0,
                        0, 1, 0, 0,
                        0, 0, 1, 0,
                        1, 2, 3, 1
                    ));
                });
            });

            describe("when matA is the output matrix", function() {
                beforeEach(function() { result = mat4.rotate(matA, matA, rad, axis); });

                it("should place values into matA", function() {
                    expect(matA).toBeEqualish(mat4.fromValues(
                        1, 0, 0, 0,
                        0, Math.cos(rad), Math.sin(rad), 0,
                        0, -Math.sin(rad), Math.cos(rad), 0,
                        1, 2, 3, 1
                    ));
                });
                it("should return matA", function() { expect(result).toBe(matA); });
            });
        });

        describe("rotateX", function() {
            let rad = Math.PI * 0.5;

            describe("with a separate output matrix", function() {
                beforeEach(function() { result = mat4.rotateX(out, matA, rad); });

                it("should place values into out", function() {
                    expect(out).toBeEqualish(mat4.fromValues(
                        1, 0, 0, 0,
                        0, Math.cos(rad), Math.sin(rad), 0,
                        0, -Math.sin(rad), Math.cos(rad), 0,
                        1, 2, 3, 1
                    ));
                });
                it("should return out", function() { expect(result).toBe(out); });
                it("should not modify matA", function() {
                    expect(matA).toBeEqualish(mat4.fromValues(
                        1, 0, 0, 0,
                        0, 1, 0, 0,
                        0, 0, 1, 0,
                        1, 2, 3, 1
                    ));
                });
            });

            describe("when matA is the output matrix", function() {
                beforeEach(function() { result = mat4.rotateX(matA, matA, rad); });

                it("should place values into matA", function() {
                    expect(matA).toBeEqualish(mat4.fromValues(
                        1, 0, 0, 0,
                        0, Math.cos(rad), Math.sin(rad), 0,
                        0, -Math.sin(rad), Math.cos(rad), 0,
                        1, 2, 3, 1
                    ));
                });
                it("should return matA", function() { expect(result).toBe(matA); });
            });
        });

        describe("rotateY", function() {
            let rad = Math.PI * 0.5;

            describe("with a separate output matrix", function() {
                beforeEach(function() { result = mat4.rotateY(out, matA, rad); });

                it("should place values into out", function() {
                    expect(out).toBeEqualish(mat4.fromValues(
                        Math.cos(rad), 0, -Math.sin(rad), 0,
                        0, 1, 0, 0,
                        Math.sin(rad), 0, Math.cos(rad), 0,
                        1, 2, 3, 1
                    ));
                });
                it("should return out", function() { expect(result).toBe(out); });
                it("should not modify matA", function() {
                    expect(matA).toBeEqualish(mat4.fromValues(
                        1, 0, 0, 0,
                        0, 1, 0, 0,
                        0, 0, 1, 0,
                        1, 2, 3, 1
                    ));
                });
            });

            describe("when matA is the output matrix", function() {
                beforeEach(function() { result = mat4.rotateY(matA, matA, rad); });

                it("should place values into matA", function() {
                    expect(matA).toBeEqualish(mat4.fromValues(
                        Math.cos(rad), 0, -Math.sin(rad), 0,
                        0, 1, 0, 0,
                        Math.sin(rad), 0, Math.cos(rad), 0,
                        1, 2, 3, 1
                    ));
                });
                it("should return matA", function() { expect(result).toBe(matA); });
            });
        });

        describe("rotateZ", function() {
            let rad = Math.PI * 0.5;

            describe("with a separate output matrix", function() {
                beforeEach(function() { result = mat4.rotateZ(out, matA, rad); });

                it("should place values into out", function() {
                    expect(out).toBeEqualish(mat4.fromValues(
                        Math.cos(rad), Math.sin(rad), 0, 0,
                        -Math.sin(rad), Math.cos(rad), 0, 0,
                        0, 0, 1, 0,
                        1, 2, 3, 1
                    ));
                });
                it("should return out", function() { expect(result).toBe(out); });
                it("should not modify matA", function() {
                    expect(matA).toBeEqualish(mat4.fromValues(
                        1, 0, 0, 0,
                        0, 1, 0, 0,
                        0, 0, 1, 0,
                        1, 2, 3, 1
                    ));
                });
            });

            describe("when matA is the output matrix", function() {
                beforeEach(function() { result = mat4.rotateZ(matA, matA, rad); });

                it("should place values into matA", function() {
                    expect(matA).toBeEqualish(mat4.fromValues(
                        Math.cos(rad), Math.sin(rad), 0, 0,
                        -Math.sin(rad), Math.cos(rad), 0, 0,
                        0, 0, 1, 0,
                        1, 2, 3, 1
                    ));
                });
                it("should return matA", function() { expect(result).toBe(matA); });
            });
        });

        // TODO: fromRotationTranslation

        describe("getTranslation", function() {
            describe("from the identity matrix", function() {
                beforeEach(function() {
                    vec3result = vec3.fromValues(1, 2, 3);
                    v3out = vec3.fromValues(1, 2, 3);
                    vec3result = mat4.getTranslation(v3out, identity);
                });
                it("should place result both in result and out", function() { expect(vec3result).toBe(v3out); });
                it("should return the zero vector", function() { expect(vec3result).toBeEqualish(vec3.fromValues(0, 0, 0)); });
            });

            describe("from a translation-only matrix", function() {
                beforeEach(function() {
                    vec3result = vec3.fromValues(1, 2, 3);
                    v3out = vec3.fromValues(1, 2, 3);
                    vec3result = mat4.getTranslation(v3out, matB);
                });
                it("should return translation vector", function() { expect(v3out).toBeEqualish(vec3.fromValues(4, 5, 6)); });
            });

            describe("from a translation and rotation matrix", function() {
                beforeEach(function() {
                    let q = quat.create();
                    let v = vec3.fromValues(5, 6, 7);
                    q = quat.setAxisAngle(q, vec3.fromValues(0.26726124, 0.534522474, 0.8017837), 0.55);
                    mat4.fromRotationTranslation(out, q, v);

                    vec3result = vec3.create();
                    mat4.getTranslation(vec3result, out);
                });
                it("should keep the same translation vector, regardless of rotation", function() {
                    expect(vec3result).toBeEqualish(vec3.fromValues(5, 6, 7));
                });
            });
        });

        describe("getScaling", function() {
            describe("from the identity matrix", function() {
                beforeEach(function() {
                    vec3result = vec3.fromValues(1, 2, 3);
                    v3out = vec3.fromValues(1, 2, 3);
                    vec3result = mat4.getScaling(v3out, identity);
                });
                it("should place result both in result and out", function() { expect(vec3result).toBe(v3out); });
                it("should return the identity vector", function() { expect(vec3result).toBeEqualish(vec3.fromValues(1, 1, 1)); });
            });

            describe("from a scale-only matrix", function() {
                beforeEach(function() {
                    let v = vec3.fromValues(4, 5, 6);
                    vec3result = vec3.fromValues(1, 2, 3)
                    v3out = vec3.fromValues(1, 2, 3);
                    mat4.fromScaling(matA, v);
                    vec3result = mat4.getScaling(v3out, matA);
                });
                it("should return translation vector", function() { expect(v3out).toBeEqualish(vec3.fromValues(4, 5, 6)); });
            });

            describe("from a translation and rotation matrix", function() {
                beforeEach(function() {
                    let q = quat.create();
                    let v = vec3.fromValues(5, 6, 7);
                    q = quat.setAxisAngle(q, vec3.fromValues(1, 0, 0), 0.5);
                    mat4.fromRotationTranslation(out, q, v);

                    vec3result = vec3.fromValues(1, 2, 3);
                    mat4.getScaling(vec3result, out);
                })
                it("should return the identity vector", function() { expect(vec3result).toBeEqualish(vec3.fromValues(1, 1, 1)); });
            });

            describe("from a translation, rotation and scale matrix", function() {
                beforeEach(function() {
                    let q = quat.create();
                    let t = vec3.fromValues(1, 2, 3);
                    let s = vec3.fromValues(5, 6, 7);
                    q = quat.setAxisAngle(q, vec3.fromValues(0, 1, 0), 0.7);
                    mat4.fromRotationTranslationScale(out, q, t, s);
                    vec3result = vec3.fromValues(5, 6, 7);
                    mat4.getScaling(vec3result, out);
                })
                it("should return the same scaling factor when created", function() { expect(vec3result).toBeEqualish(vec3.fromValues(5, 6, 7)); });
            });

        });

        describe("getRotation", function() {
            let qout: Quat;
            let quatresult: Quat;

            describe("from the identity matrix", function() {
                beforeEach(function() {
                    quatresult = quat.fromValues(1, 2, 3, 4);
                    qout = quat.fromValues(1, 2, 3, 4);
                    quatresult = mat4.getRotation(qout, identity);
                });
                it("should place result both in result and out", function() { expect(quatresult).toBe(qout); });
                it("should return the unit quaternion", function() {
                    let unitQuat = quat.create();
                    quat.identity(unitQuat);
                    expect(quatresult).toBeEqualish(unitQuat);
                });
            });

            describe("from a translation-only matrix", function() {
                beforeEach(function() {
                    quatresult = quat.fromValues(1, 2, 3, 4);
                    qout = quat.fromValues(1, 2, 3, 4);
                    quatresult = mat4.getRotation(qout, matB);
                });
                it("should return the unit quaternion", function() {
                    let unitQuat = quat.create();
                    quat.identity(unitQuat);
                    expect(quatresult).toBeEqualish(unitQuat);
                });
            });

            describe("from a translation and rotation matrix", function() {
                it("should keep the same rotation as when created", function() {
                    let q = quat.create();
                    let outVec = vec3.fromValues(5, 6, 7);
                    let testVec = vec3.fromValues(1, 5, 2);
                    let ang = 0.78972;

                    vec3.normalize(testVec, testVec);
                    q = quat.setAxisAngle(q, testVec, ang);
                    mat4.fromRotationTranslation(out, q, outVec);

                    let quatResult = quat.fromValues(2, 3, 4, 6);
                    mat4.getRotation(quatResult, out);
                    let outaxis = vec3.create();
                    let outangle = quat.getAxisAngle(outaxis, quatResult);

                    expect(outaxis).toBeEqualish(testVec);
                    expect(outangle).toBeNearly(ang);
                });
            });
        });

        describe("frustum", function() {
            beforeEach(function() { result = mat4.frustum(out, -1, 1, -1, 1, -1, 1); });
            it("should place values into out", function() { expect(result).toBeEqualish(mat4.fromValues(
                    -1, 0, 0, 0,
                    0, -1, 0, 0,
                    0, 0, 0, -1,
                    0, 0, 1, 0
                ));
            });
            it("should return out", function() { expect(result).toBe(out); });
        });

        describe("perspective", function() {
            let fovy = Math.PI * 0.5;
            beforeEach(function() { result = mat4.perspective(out, fovy, 1, 0, 1); });
            it("should place values into out", function() { expect(result).toBeEqualish(mat4.fromValues(
                    1, 0, 0, 0,
                    0, 1, 0, 0,
                    0, 0, -1, -1,
                    0, 0, 0, 0
                ));
            });
            it("should return out", function() { expect(result).toBe(out); });

            describe("with nonzero near, 45deg fovy, and realistic aspect ratio", function() {
                beforeEach(function() { result = mat4.perspective(out, 45 * Math.PI / 180.0, 640/480, 0.1, 200); });
                it("should calculate correct matrix", function() { expect(result).toBeEqualish(mat4.fromValues(
                    1.81066, 0, 0, 0,
                    0, 2.414213, 0, 0,
                    0, 0, -1.001, -1,
                    0, 0, -0.2001, 0
                )); });
            });

            describe("with no far plane, 45deg fovy, and realistic aspect ratio", function() {
                beforeEach(function() { result = mat4.perspective(out, 45 * Math.PI / 180.0, 640/480, 0.1); });
                it("should calculate correct matrix", function() { expect(result).toBeEqualish(mat4.fromValues(
                    1.81066, 0, 0, 0,
                    0, 2.414213, 0, 0,
                    0, 0, -1, -1,
                    0, 0, -0.2, 0
                )); });
            });

            describe("with infinite far plane, 45deg fovy, and realistic aspect ratio", function() {
                beforeEach(function() { result = mat4.perspective(out, 45 * Math.PI / 180.0, 640/480, 0.1, Infinity); });
                it("should calculate correct matrix", function() { expect(result).toBeEqualish(mat4.fromValues(
                    1.81066, 0, 0, 0,
                    0, 2.414213, 0, 0,
                    0, 0, -1, -1,
                    0, 0, -0.2, 0
                )); });
            });
        });

        describe("ortho", function() {
            beforeEach(function() { result = mat4.ortho(out, -1, 1, -1, 1, -1, 1); });
            it("should place values into out", function() { expect(result).toBeEqualish(mat4.fromValues(
                    1, 0, 0, 0,
                    0, 1, 0, 0,
                    0, 0, -1, 0,
                    0, 0, 0, 1
                ));
            });
            it("should return out", function() { expect(result).toBe(out); });
        });

        describe("lookAt", function() {
            let eye    = new Float32Array([0, 0, 1]) as Vec3;
            let center = new Float32Array([0, 0, -1]) as Vec3;
            let up     = new Float32Array([0, 1, 0]) as Vec3;
            let view: Vec3;
            let right: Vec3;

            describe("looking down", function() {
                beforeEach(function() {
                    view = new Float32Array([0, -1,  0]) as Vec3;
                    up   = new Float32Array([0,  0, -1]) as Vec3;
                    right= new Float32Array([1,  0,  0]) as Vec3;
                    result = mat4.lookAt(out, vec3.fromValues(0, 0, 0), view, up);
                });

                it("should transform view into local -Z", function() {
                    vec3result = vec3.transformMat4(new Float32Array(3) as Vec3, view, out);
                    expect(vec3result).toBeEqualish(vec3.fromValues(0, 0, -1));
                });

                it("should transform up into local +Y", function() {
                    vec3result = vec3.transformMat4(new Float32Array(3) as Vec3, up, out);
                    expect(vec3result).toBeEqualish(vec3.fromValues(0, 1, 0));
                });

                it("should transform right into local +X", function() {
                    vec3result = vec3.transformMat4(new Float32Array(3) as Vec3, right, out);
                    expect(vec3result).toBeEqualish(vec3.fromValues(1, 0, 0));
                });

                it("should return out", function() { expect(result).toBe(out); });
            });

            describe("#74", function() {
                beforeEach(function() {
                    mat4.lookAt(out,
                        new Float32Array([0,2,0]) as Vec3,
                        new Float32Array([0,0.6,0]) as Vec3,
                        new Float32Array([0,0,-1]) as Vec3)
                });

                it("should transform a point 'above' into local +Y", function() {
                    vec3result = vec3.transformMat4(new Float32Array(3) as Vec3, vec3.fromValues(0, 2, -1), out);
                    expect(vec3result).toBeEqualish(vec3.fromValues(0, 1, 0));
                });

                it("should transform a point 'right of' into local +X", function() {
                    vec3result = vec3.transformMat4(new Float32Array(3) as Vec3, vec3.fromValues(1, 2, 0), out);
                    expect(vec3result).toBeEqualish(vec3.fromValues(1, 0, 0));
                });

                it("should transform a point 'in front of' into local -Z", function() {
                    vec3result = vec3.transformMat4(new Float32Array(3) as Vec3, vec3.fromValues(0, 1, 0), out);
                    expect(vec3result).toBeEqualish(vec3.fromValues(0, 0, -1));
                });
            });

            beforeEach(function() {
                eye    = new Float32Array([0, 0, 1]) as Vec3;
                center = new Float32Array([0, 0, -1]) as Vec3;
                up     = new Float32Array([0, 1, 0]) as Vec3;
                result = mat4.lookAt(out, eye, center, up);
            });
            it("should place values into out", function() { expect(result).toBeEqualish(mat4.fromValues(
                    1, 0, 0, 0,
                    0, 1, 0, 0,
                    0, 0, 1, 0,
                    0, 0, -1, 1
                ));
            });
            it("should return out", function() { expect(result).toBe(out); });
        });

        describe("targetTo", function() {
            let eye    = new Float32Array([0, 0, 1]) as Vec3;
            let center = new Float32Array([0, 0, -1]) as Vec3;
            let up     = new Float32Array([0, 1, 0]) as Vec3;
            var view: Vec3;
            let right: Vec3;

            describe("looking down", function() {
                beforeEach(function() {
                    view = new Float32Array([0, -1,  0]) as Vec3;
                    up   = new Float32Array([0,  0, -1]) as Vec3;
                    right= new Float32Array([1,  0,  0]) as Vec3;
                    result = mat4.targetTo(out, vec3.fromValues(0, 0, 0), view, up);
                });

                it("should transform view into local Z", function() {
                    vec3result = vec3.transformMat4(new Float32Array(3) as Vec3, view, out);
                    expect(vec3result).toBeEqualish(vec3.fromValues(0, 0, 1));
                });

                it("should transform up into local -Y", function() {
                    vec3result = vec3.transformMat4(new Float32Array(3) as Vec3, up, out);
                    expect(vec3result).toBeEqualish(vec3.fromValues(0, -1, 0));
                });

                it("should transform right into local +X", function() {
                    vec3result = vec3.transformMat4(new Float32Array(3) as Vec3, right, out);
                    expect(vec3result).toBeEqualish(vec3.fromValues(1, 0, 0));
                });

                it("should return out", function() { expect(result).toBe(out); });

                it("scaling should be [1, 1, 1]", function(){
                    var scaling = mat4.getScaling(new Float32Array(3) as Vec3, out);
                    expect(scaling).toBeEqualish(vec3.fromValues(1, 1, 1));
                });
            });

            describe("#74", function() {
                beforeEach(function() {
                    mat4.targetTo(out,
                        new Float32Array([0,2,0]) as Vec3,
                        new Float32Array([0,0.6,0]) as Vec3,
                        new Float32Array([0,0,-1]) as Vec3);
                });

                it("should transform a point 'above' into local +Y", function() {
                    vec3result = vec3.transformMat4(new Float32Array(3) as Vec3, vec3.fromValues(0, 2, -1), out);
                    expect(vec3result).toBeEqualish(vec3.fromValues(0, 1, -2));
                });

                it("should transform a point 'right of' into local +X", function() {
                    vec3result = vec3.transformMat4(new Float32Array(3) as Vec3, vec3.fromValues(1, 2, 0), out);
                    expect(vec3result).toBeEqualish(vec3.fromValues(1, 2, -2));
                });

                it("should transform a point 'in front of' into local -Z", function() {
                    vec3result = vec3.transformMat4(new Float32Array(3) as Vec3, vec3.fromValues(0, 1, 0), out);
                    expect(vec3result).toBeEqualish(vec3.fromValues(0, 2, -1));
                });

                it("scaling should be [1, 1, 1]", function(){
                    var scaling = mat4.getScaling(new Float32Array(3) as Vec3, out);
                    expect(scaling).toBeEqualish(vec3.fromValues(1, 1, 1));
                });
            });

            describe("scaling test", function(){
                beforeEach(function() {
                    mat4.targetTo(out,
                        new Float32Array([0,1,0]) as Vec3,
                        new Float32Array([0,0,1]) as Vec3,
                        new Float32Array([0,0,-1]) as Vec3);
                });

                it("scaling should be [1, 1, 1]", function(){
                    var scaling = mat4.getScaling(new Float32Array(3) as Vec3, out);
                    expect(scaling).toBeEqualish(vec3.fromValues(1, 1, 1));
                });
            });

            beforeEach(function() {
                eye    = new Float32Array([0, 0, 1]) as Vec3;
                center = new Float32Array([0, 0, -1]) as Vec3;
                up     = new Float32Array([0, 1, 0]) as Vec3;
                result = mat4.targetTo(out, eye, center, up);
            });
            it("should place values into out", function() { expect(result).toBeEqualish(mat4.fromValues(
                    1, 0, 0, 0,
                    0, 1, 0, 0,
                    0, 0, 1, 0,
                    0, 0, 1, 1
                ));
            });
            it("should return out", function() { expect(result).toBe(out); });
            it("scaling should be [1, 1, 1]", function(){
                var scaling = mat4.getScaling(new Float32Array(3) as Vec3, out);
                expect(scaling).toBeEqualish(vec3.fromValues(1, 1, 1));
            });
        });

        describe("str", function() {
            beforeEach(function() { strResult = mat4.str(matA); });

            it("should return a string representation of the matrix", function() { expect(strResult).toEqual("mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 2, 3, 1)"); });
        });

       describe("frob", function() {
            beforeEach(function() { numResult = mat4.frob(matA); });
            it("should return the Frobenius Norm of the matrix", function() { expect(numResult).toBeNearly( Math.sqrt(Math.pow(1, 2) + Math.pow(1, 2) + Math.pow(1, 2) + Math.pow(1, 2) + Math.pow(1, 2) + Math.pow(2, 2) + Math.pow(3, 2) )); });
       });

    describe("add", function() {
        beforeEach(function() {
            matA = mat4.fromValues(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16)
            matB = mat4.fromValues(17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32)
        });
        describe("with a separate output matrix", function() {
            beforeEach(function() {
                result = mat4.add(out, matA, matB);
            });

            it("should place values into out", function() { expect(out).toBeEqualish(mat4.fromValues(18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48)); });
            it("should return out", function() { expect(result).toBe(out); });
            it("should not modify matA", function() { expect(matA).toBeEqualish(mat4.fromValues(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16)); });
            it("should not modify matB", function() { expect(matB).toBeEqualish(mat4.fromValues(17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32)); });
        });

        describe("when matA is the output matrix", function() {
            beforeEach(function() { result = mat4.add(matA, matA, matB); });

            it("should place values into matA", function() { expect(matA).toBeEqualish(mat4.fromValues(18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48)); });
            it("should return matA", function() { expect(result).toBe(matA); });
            it("should not modify matB", function() { expect(matB).toBeEqualish(mat4.fromValues(17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32)); });
        });

        describe("when matB is the output matrix", function() {
            beforeEach(function() { result = mat4.add(matB, matA, matB); });

            it("should place values into matB", function() { expect(matB).toBeEqualish(mat4.fromValues(18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48)); });
            it("should return matB", function() { expect(result).toBe(matB); });
            it("should not modify matA", function() { expect(matA).toBeEqualish(mat4.fromValues(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16)); });
        });
    });

    describe("subtract", function() {
        beforeEach(function() {
            matA = mat4.fromValues(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
            matB = mat4.fromValues(17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32);
        });
        it("should have an alias called 'sub'", function() { expect(mat4.sub).toEqual(mat4.subtract); });

        describe("with a separate output matrix", function() {
            beforeEach(function() { result = mat4.subtract(out, matA, matB); });

            it("should place values into out", function() { expect(out).toBeEqualish(mat4.fromValues(-16, -16, -16, -16, -16, -16, -16, -16, -16, -16, -16, -16, -16, -16, -16, -16)); });
            it("should return out", function() { expect(result).toBe(out); });
            it("should not modify matA", function() { expect(matA).toBeEqualish(mat4.fromValues(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16)); });
            it("should not modify matB", function() { expect(matB).toBeEqualish(mat4.fromValues(17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32)); });
        });

        describe("when matA is the output matrix", function() {
            beforeEach(function() { result = mat4.subtract(matA, matA, matB); });

            it("should place values into matA", function() { expect(matA).toBeEqualish(mat4.fromValues(-16, -16, -16, -16, -16, -16, -16, -16, -16, -16, -16, -16, -16, -16, -16, -16)); });
            it("should return matA", function() { expect(result).toBe(matA); });
            it("should not modify matB", function() { expect(matB).toBeEqualish(mat4.fromValues(17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32)); });
        });

        describe("when matB is the output matrix", function() {
            beforeEach(function() { result = mat4.subtract(matB, matA, matB); });

            it("should place values into matB", function() { expect(matB).toBeEqualish(mat4.fromValues(-16, -16, -16, -16, -16, -16, -16, -16, -16, -16, -16, -16, -16, -16, -16, -16)); });
            it("should return matB", function() { expect(result).toBe(matB); });
            it("should not modify matA", function() { expect(matA).toBeEqualish(mat4.fromValues(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16)); });
        });
    });

    describe("fromValues", function() {
        beforeEach(function() { result = mat4.fromValues(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16); });
        it("should return a 16 element array initialized to the values passed", function() { expect(result).toBeEqualish(mat4.fromValues(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16)); });
    });

    describe("set", function() {
        beforeEach(function() { result = mat4.set(out, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16); });
        it("should place values into out", function() { expect(out).toBeEqualish(mat4.fromValues(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16)); });
        it("should return out", function() { expect(result).toBe(out); });
    });

    describe("multiplyScalar", function() {
        beforeEach(function() {
            matA = mat4.fromValues(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
        });
        describe("with a separate output matrix", function() {
            beforeEach(function() { result = mat4.multiplyScalar(out, matA, 2); });

            it("should place values into out", function() { expect(out).toBeEqualish(mat4.fromValues(2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32)); });
            it("should return out", function() { expect(result).toBe(out); });
            it("should not modify matA", function() { expect(matA).toBeEqualish(mat4.fromValues(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16)); });
        });

        describe("when matA is the output matrix", function() {
            beforeEach(function() { result = mat4.multiplyScalar(matA, matA, 2); });

            it("should place values into matA", function() { expect(matA).toBeEqualish(mat4.fromValues(2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32)); });
            it("should return matA", function() { expect(result).toBe(matA); });
        });
    });

    describe("multiplyScalarAndAdd", function() {
        beforeEach(function() {
            matA = mat4.fromValues(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
            matB = mat4.fromValues(17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32);
        });
        describe("with a separate output matrix", function() {
            beforeEach(function() { result = mat4.multiplyScalarAndAdd(out, matA, matB, 0.5); });

            it("should place values into out", function() { expect(out).toBeEqualish(mat4.fromValues(9.5, 11, 12.5, 14, 15.5, 17, 18.5, 20, 21.5, 23, 24.5, 26, 27.5, 29, 30.5, 32)); });
            it("should return out", function() { expect(result).toBe(out); });
            it("should not modify matA", function() { expect(matA).toBeEqualish(mat4.fromValues(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16)); });
            it("should not modify matB", function() { expect(matB).toBeEqualish(mat4.fromValues(17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32)); });
        });

        describe("when matA is the output matrix", function() {
            beforeEach(function() { result = mat4.multiplyScalarAndAdd(matA, matA, matB, 0.5); });

            it("should place values into matA", function() { expect(matA).toBeEqualish(mat4.fromValues(9.5, 11, 12.5, 14, 15.5, 17, 18.5, 20, 21.5, 23, 24.5, 26, 27.5, 29, 30.5, 32)); });
            it("should return matA", function() { expect(result).toBe(matA); });
            it("should not modify matB", function() { expect(matB).toBeEqualish(mat4.fromValues(17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32)); });
        });

        describe("when matB is the output matrix", function() {
            beforeEach(function() { result = mat4.multiplyScalarAndAdd(matB, matA, matB, 0.5); });

            it("should place values into matB", function() { expect(matB).toBeEqualish(mat4.fromValues(9.5, 11, 12.5, 14, 15.5, 17, 18.5, 20, 21.5, 23, 24.5, 26, 27.5, 29, 30.5, 32)); });
            it("should return matB", function() { expect(result).toBe(matB); });
            it("should not modify matA", function() { expect(matA).toBeEqualish(mat4.fromValues(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16)); });
        });
    });

    describe("exactEquals", function() {
        let matC: Mat4; 
        let r0: boolean;
        let r1: boolean;
        beforeEach(function() {
            matA = mat4.fromValues(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
            matB = mat4.fromValues(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
            matC = mat4.fromValues(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
            r0 = mat4.exactEquals(matA, matB);
            r1 = mat4.exactEquals(matA, matC);
        });

        it("should return true for identical matrices", function() { expect(r0).toBe(true); });
        it("should return false for different matrices", function() { expect(r1).toBe(false); });
        it("should not modify matA", function() { expect(matA).toBeEqualish(mat4.fromValues(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15)); });
        it("should not modify matB", function() { expect(matB).toBeEqualish(mat4.fromValues(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15)); });
    });

    describe("equals", function() {
        let matC: Mat4; 
        let matD: Mat4;
        let r0: boolean;
        let r1: boolean;
        let r2: boolean;
        beforeEach(function() {
            matA = mat4.fromValues(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
            matB = mat4.fromValues(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
            matC = mat4.fromValues(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
            matD = mat4.fromValues(1e-16, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
            r0 = mat4.equals(matA, matB);
            r1 = mat4.equals(matA, matC);
            r2 = mat4.equals(matA, matD);
        });
        it("should return true for identical matrices", function() { expect(r0).toBe(true); });
        it("should return false for different matrices", function() { expect(r1).toBe(false); });
        it("should return true for close but not identical matrices", function() { expect(r2).toBe(true); });
        it("should not modify matA", function() { expect(matA).toBeEqualish(mat4.fromValues(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15)); });
        it("should not modify matB", function() { expect(matB).toBeEqualish(mat4.fromValues(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15)); });
    });

}
}

describe("mat4", buildMat4Tests());