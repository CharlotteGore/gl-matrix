import * as mat3 from "./mat3"
import * as mat4 from "./mat4"
import * as vec3 from "./vec3"
import * as quat from "./quat"

import { EPSILON } from "./common";
import { Vec3, Mat4, Mat3 } from "./types";

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
describe("vec3", function() {
    let out: Vec3;
    let vecA: Vec3;
    let vecB: Vec3; 
    let result: Vec3;
    let numResult: number;
    let strResult: string;

    beforeEach(function() { vecA = vec3.fromValues(1, 2, 3); vecB = vec3.fromValues(4, 5, 6); out = vec3.fromValues(0, 0, 0); });

    describe('rotateX', function(){
     	describe('rotation around world origin [0, 0, 0]', function(){
    			  beforeEach(function(){ vecA = vec3.fromValues(0, 1, 0); vecB = vec3.fromValues(0, 0, 0); result = vec3.rotateX(out, vecA, vecB, Math.PI); });
    			  it("should return the rotated vector", function(){ expect(result).toBeEqualish(vec3.fromValues(0, -1, 0)); });
    		});
    		describe('rotation around an arbitrary origin', function(){
    			  beforeEach(function(){ vecA = vec3.fromValues(2, 7, 0); vecB = vec3.fromValues(2, 5, 0); result = vec3.rotateX(out, vecA, vecB, Math.PI); });
    			  it("should return the rotated vector", function(){ expect(result).toBeEqualish(vec3.fromValues(2, 3, 0)); });
    		});
    	});

    	describe('rotateY', function(){
    		describe('rotation around world origin [0, 0, 0]', function(){
    			  beforeEach(function(){ vecA = vec3.fromValues(1, 0, 0); vecB = vec3.fromValues(0, 0, 0); result = vec3.rotateY(out, vecA, vecB, Math.PI); });
    			  it("should return the rotated vector", function(){ expect(result).toBeEqualish(vec3.fromValues(-1, 0, 0)); });
    		});
    		describe('rotation around an arbitrary origin', function(){
    			  beforeEach(function(){ vecA = vec3.fromValues(-2, 3, 10); vecB = vec3.fromValues(-4, 3, 10); result = vec3.rotateY(out, vecA, vecB, Math.PI); });
    			  it("should return the rotated vector", function(){ expect(result).toBeEqualish(vec3.fromValues(-6, 3, 10)); });
    		});
    	});

    	describe('rotateZ', function(){
    		describe('rotation around world origin [0, 0, 0]', function(){
    			  beforeEach(function(){ vecA = vec3.fromValues(0, 1, 0); vecB = vec3.fromValues(0, 0, 0); result = vec3.rotateZ(out, vecA, vecB, Math.PI); });
    			  it("should return the rotated vector", function(){ expect(result).toBeEqualish(vec3.fromValues(0, -1, 0)); });
    		});
    		describe('rotation around an arbitrary origin', function(){
    			  beforeEach(function(){ vecA = vec3.fromValues(0, 6, -5); vecB = vec3.fromValues(0, 0, -5); result = vec3.rotateZ(out, vecA, vecB, Math.PI); });
    			  it("should return the rotated vector", function(){ expect(result).toBeEqualish(vec3.fromValues(0, -6, -5)); });
    		});
    	});

    describe('transformMat4', function() {
        let matr: Mat4;

        describe("with an identity", function() {
            beforeEach(function() { matr = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1 ]) as Mat4 });

            beforeEach(function() { result = vec3.transformMat4(out, vecA, matr); });

            it("should produce the input", function() {
                expect(out).toBeEqualish(vec3.fromValues(1, 2, 3));
            });

            it("should return out", function() { expect(result).toBe(out); });
        });

        describe("with a lookAt", function() {
            beforeEach(function() { matr = mat4.lookAt(mat4.create(), vec3.fromValues(5, 6, 7), vec3.fromValues(2, 6, 7), vec3.fromValues(0, 1, 0)); });

            beforeEach(function() { result = vec3.transformMat4(out, vecA, matr); });

            it("should rotate and translate the input", function() {
                expect(out).toBeEqualish(vec3.fromValues( 4, -4, -4 ));
            });

            it("should return out", function() { expect(result).toBe(out); });
        });

        describe("with a perspective matrix (#92)", function() {
            it("should transform a point from perspective(pi/2, 4/3, 1, 100)", function() {
                matr = mat4.fromValues(0.750, 0, 0, 0,
                        0, 1, 0, 0,
                        0, 0, -1.02, -1,
                        0, 0, -2.02, 0);
                result = vec3.transformMat4(vec3.create(), vec3.fromValues(10, 20, 30), matr);
                expect(result).toBeEqualish(vec3.fromValues(-0.25, -0.666666, 1.087333));
            });
        });

    });

    describe('transformMat3', function() {
        let matr: Mat3;
        describe("with an identity", function() {
            beforeEach(function() { matr = mat3.fromValues(1, 0, 0, 0, 1, 0, 0, 0, 1 ) });

            beforeEach(function() { result = vec3.transformMat3(out, vecA, matr); });

            it("should produce the input", function() {
                expect(out).toBeEqualish(vec3.fromValues(1, 2, 3));
            });

            it("should return out", function() { expect(result).toBe(out); });
        });

        describe("with 90deg about X", function() {
            beforeEach(function() {
                result = vec3.transformMat3(out, vec3.fromValues(0,1,0), mat3.fromValues(1,0,0,0,0,1,0,-1,0));
            });

            it("should produce correct output", function() {
                expect(out).toBeEqualish(vec3.fromValues(0,0,1));
            });
        });

        describe("with 90deg about Y", function() {
            beforeEach(function() {
                result = vec3.transformMat3(out, vec3.fromValues(1,0,0), mat3.fromValues(0,0,-1,0,1,0,1,0,0));
            });

            it("should produce correct output", function() {
                expect(out).toBeEqualish(vec3.fromValues(0,0,-1));
            });
        });

        describe("with 90deg about Z", function() {
            beforeEach(function() {
                result = vec3.transformMat3(out, vec3.fromValues(1,0,0), mat3.fromValues(0,1,0,-1,0,0,0,0,1));
            });

            it("should produce correct output", function() {
                expect(out).toBeEqualish(vec3.fromValues(0,1,0));
            });
        });

        describe("with a lookAt normal matrix", function() {
            let matr4: Mat4
            beforeEach(function() {
                matr4 = mat4.lookAt(mat4.create(), vec3.fromValues(5, 6, 7), vec3.fromValues(2, 6, 7), vec3.fromValues(0, 1, 0));
                let n = mat3.create();
                matr = mat3.transpose(n, mat3.invert(n, mat3.fromMat4(n, matr4)));
            });

            beforeEach(function() { result = vec3.transformMat3(out, vec3.fromValues(1,0,0), matr); });

            it("should rotate the input", function() {
                expect(out).toBeEqualish(vec3.fromValues( 0,0,1 ));
            });

            it("should return out", function() { expect(result).toBe(out); });
        });
    });

    describe("transformQuat", function() {
       beforeEach(function() { result = vec3.transformQuat(out, vecA, quat.fromValues(0.18257418567011074, 0.3651483713402215, 0.5477225570103322, 0.730296742680443)); });
       it("should rotate the input vector", function() {  expect(out).toBeEqualish(vec3.fromValues(1, 2, 3)); });
       it("should return out", function() { expect(result).not.toBe(quat.fromValues(1,2,3,4)); });
    });

    describe("create", function() {
        beforeEach(function() { result = vec3.create(); });
        it("should return a 3 element array initialized to 0s", function() { expect(result).toBeEqualish(vec3.fromValues(0, 0, 0)); });
    });

    describe("clone", function() {
        beforeEach(function() { result = vec3.clone(vecA); });
        it("should return a 3 element array initialized to the values in vecA", function() { expect(result).toBeEqualish(vecA); });
    });

    describe("fromValues", function() {
        beforeEach(function() { result = vec3.fromValues(1, 2, 3); });
        it("should return a 3 element array initialized to the values passed", function() { expect(result).toBeEqualish(vec3.fromValues(1, 2, 3)); });
    });

    describe("copy", function() {
        beforeEach(function() { result = vec3.copy(out, vecA); });
        it("should place values into out", function() { expect(out).toBeEqualish(vec3.fromValues(1, 2, 3)); });
        it("should return out", function() { expect(result).toBe(out); });
    });

    describe("set", function() {
        beforeEach(function() { result = vec3.set(out, 1, 2, 3); });
        it("should place values into out", function() { expect(out).toBeEqualish(vec3.fromValues(1, 2, 3)); });
        it("should return out", function() { expect(result).toBe(out); });
    });

    describe("add", function() {
        describe("with a separate output vector", function() {
            beforeEach(function() { result = vec3.add(out, vecA, vecB); });

            it("should place values into out", function() { expect(out).toBeEqualish(vec3.fromValues(5, 7, 9)); });
            it("should return out", function() { expect(result).toBe(out); });
            it("should not modify vecA", function() { expect(vecA).toBeEqualish(vec3.fromValues(1, 2, 3)); });
            it("should not modify vecB", function() { expect(vecB).toBeEqualish(vec3.fromValues(4, 5, 6)); });
        });

        describe("when vecA is the output vector", function() {
            beforeEach(function() { result = vec3.add(vecA, vecA, vecB); });

            it("should place values into vecA", function() { expect(vecA).toBeEqualish(vec3.fromValues(5, 7, 9)); });
            it("should return vecA", function() { expect(result).toBe(vecA); });
            it("should not modify vecB", function() { expect(vecB).toBeEqualish(vec3.fromValues(4, 5, 6)); });
        });

        describe("when vecB is the output vector", function() {
            beforeEach(function() { result = vec3.add(vecB, vecA, vecB); });

            it("should place values into vecB", function() { expect(vecB).toBeEqualish(vec3.fromValues(5, 7, 9)); });
            it("should return vecB", function() { expect(result).toBe(vecB); });
            it("should not modify vecA", function() { expect(vecA).toBeEqualish(vec3.fromValues(1, 2, 3)); });
        });
    });

    describe("subtract", function() {
        it("should have an alias called 'sub'", function() { expect(vec3.sub).toEqual(vec3.subtract); });

        describe("with a separate output vector", function() {
            beforeEach(function() { result = vec3.subtract(out, vecA, vecB); });

            it("should place values into out", function() { expect(out).toBeEqualish(vec3.fromValues(-3, -3, -3)); });
            it("should return out", function() { expect(result).toBe(out); });
            it("should not modify vecA", function() { expect(vecA).toBeEqualish(vec3.fromValues(1, 2, 3)); });
            it("should not modify vecB", function() { expect(vecB).toBeEqualish(vec3.fromValues(4, 5, 6)); });
        });

        describe("when vecA is the output vector", function() {
            beforeEach(function() { result = vec3.subtract(vecA, vecA, vecB); });

            it("should place values into vecA", function() { expect(vecA).toBeEqualish(vec3.fromValues(-3, -3, -3)); });
            it("should return vecA", function() { expect(result).toBe(vecA); });
            it("should not modify vecB", function() { expect(vecB).toBeEqualish(vec3.fromValues(4, 5, 6)); });
        });

        describe("when vecB is the output vector", function() {
            beforeEach(function() { result = vec3.subtract(vecB, vecA, vecB); });

            it("should place values into vecB", function() { expect(vecB).toBeEqualish(vec3.fromValues(-3, -3, -3)); });
            it("should return vecB", function() { expect(result).toBe(vecB); });
            it("should not modify vecA", function() { expect(vecA).toBeEqualish(vec3.fromValues(1, 2, 3)); });
        });
    });

    describe("multiply", function() {
        it("should have an alias called 'mul'", function() { expect(vec3.mul).toEqual(vec3.multiply); });

        describe("with a separate output vector", function() {
            beforeEach(function() { result = vec3.multiply(out, vecA, vecB); });

            it("should place values into out", function() { expect(out).toBeEqualish(vec3.fromValues(4, 10, 18)); });
            it("should return out", function() { expect(result).toBe(out); });
            it("should not modify vecA", function() { expect(vecA).toBeEqualish(vec3.fromValues(1, 2, 3)); });
            it("should not modify vecB", function() { expect(vecB).toBeEqualish(vec3.fromValues(4, 5, 6)); });
        });

        describe("when vecA is the output vector", function() {
            beforeEach(function() { result = vec3.multiply(vecA, vecA, vecB); });

            it("should place values into vecA", function() { expect(vecA).toBeEqualish(vec3.fromValues(4, 10, 18)); });
            it("should return vecA", function() { expect(result).toBe(vecA); });
            it("should not modify vecB", function() { expect(vecB).toBeEqualish(vec3.fromValues(4, 5, 6)); });
        });

        describe("when vecB is the output vector", function() {
            beforeEach(function() { result = vec3.multiply(vecB, vecA, vecB); });

            it("should place values into vecB", function() { expect(vecB).toBeEqualish(vec3.fromValues(4, 10, 18)); });
            it("should return vecB", function() { expect(result).toBe(vecB); });
            it("should not modify vecA", function() { expect(vecA).toBeEqualish(vec3.fromValues(1, 2, 3)); });
        });
    });

    describe("divide", function() {
        it("should have an alias called 'div'", function() { expect(vec3.div).toEqual(vec3.divide); });

        describe("with a separate output vector", function() {
            beforeEach(function() { result = vec3.divide(out, vecA, vecB); });

            it("should place values into out", function() { expect(out).toBeEqualish(vec3.fromValues(0.25, 0.4, 0.5)); });
            it("should return out", function() { expect(result).toBe(out); });
            it("should not modify vecA", function() { expect(vecA).toBeEqualish(vec3.fromValues(1, 2, 3)); });
            it("should not modify vecB", function() { expect(vecB).toBeEqualish(vec3.fromValues(4, 5, 6)); });
        });

        describe("when vecA is the output vector", function() {
            beforeEach(function() { result = vec3.divide(vecA, vecA, vecB); });

            it("should place values into vecA", function() { expect(vecA).toBeEqualish(vec3.fromValues(0.25, 0.4, 0.5)); });
            it("should return vecA", function() { expect(result).toBe(vecA); });
            it("should not modify vecB", function() { expect(vecB).toBeEqualish(vec3.fromValues(4, 5, 6)); });
        });

        describe("when vecB is the output vector", function() {
            beforeEach(function() { result = vec3.divide(vecB, vecA, vecB); });

            it("should place values into vecB", function() { expect(vecB).toBeEqualish(vec3.fromValues(0.25, 0.4, 0.5)); });
            it("should return vecB", function() { expect(result).toBe(vecB); });
            it("should not modify vecA", function() { expect(vecA).toBeEqualish(vec3.fromValues(1, 2, 3)); });
        });
    });

    describe("ceil", function() {
        beforeEach(function() { vecA = vec3.fromValues(Math.E, Math.PI, Math.SQRT2); });

        describe("with a separate output vector", function() {
            beforeEach(function() { result = vec3.ceil(out, vecA); });

            it("should place values into out", function() { expect(out).toBeEqualish(vec3.fromValues(3, 4, 2)); });
            it("should return out", function() { expect(result).toBe(out); });
            it("should not modify vecA", function() { expect(vecA).toBeEqualish(vec3.fromValues(Math.E, Math.PI, Math.SQRT2)); });
        });

        describe("when vecA is the output vector", function() {
            beforeEach(function() { result = vec3.ceil(vecA, vecA); });

            it("should place values into vecA", function() { expect(vecA).toBeEqualish(vec3.fromValues(3, 4, 2)); });
            it("should return vecA", function() { expect(result).toBe(vecA); });
        });
    });

    describe("floor", function() {
        beforeEach(function() { vecA = vec3.fromValues(Math.E, Math.PI, Math.SQRT2); });

        describe("with a separate output vector", function() {
            beforeEach(function() { result = vec3.floor(out, vecA); });

            it("should place values into out", function() { expect(out).toBeEqualish(vec3.fromValues(2, 3, 1)); });
            it("should return out", function() { expect(result).toBe(out); });
            it("should not modify vecA", function() { expect(vecA).toBeEqualish(vec3.fromValues(Math.E, Math.PI, Math.SQRT2)); });
        });

        describe("when vecA is the output vector", function() {
            beforeEach(function() { result = vec3.floor(vecA, vecA); });

            it("should place values into vecA", function() { expect(vecA).toBeEqualish(vec3.fromValues(2, 3, 1)); });
            it("should return vecA", function() { expect(result).toBe(vecA); });
        });
    });

    describe("min", function() {
        beforeEach(function() { vecA = vec3.fromValues(1, 3, 1); vecB = vec3.fromValues(3, 1, 3); });

        describe("with a separate output vector", function() {
            beforeEach(function() { result = vec3.min(out, vecA, vecB); });

            it("should place values into out", function() { expect(out).toBeEqualish(vec3.fromValues(1, 1, 1)); });
            it("should return out", function() { expect(result).toBe(out); });
            it("should not modify vecA", function() { expect(vecA).toBeEqualish(vec3.fromValues(1, 3, 1)); });
            it("should not modify vecB", function() { expect(vecB).toBeEqualish(vec3.fromValues(3, 1, 3)); });
        });

        describe("when vecA is the output vector", function() {
            beforeEach(function() { result = vec3.min(vecA, vecA, vecB); });

            it("should place values into vecA", function() { expect(vecA).toBeEqualish(vec3.fromValues(1, 1, 1)); });
            it("should return vecA", function() { expect(result).toBe(vecA); });
            it("should not modify vecB", function() { expect(vecB).toBeEqualish(vec3.fromValues(3, 1, 3)); });
        });

        describe("when vecB is the output vector", function() {
            beforeEach(function() { result = vec3.min(vecB, vecA, vecB); });

            it("should place values into vecB", function() { expect(vecB).toBeEqualish(vec3.fromValues(1, 1, 1)); });
            it("should return vecB", function() { expect(result).toBe(vecB); });
            it("should not modify vecA", function() { expect(vecA).toBeEqualish(vec3.fromValues(1, 3, 1)); });
        });
    });

    describe("max", function() {
        beforeEach(function() { vecA = vec3.fromValues(1, 3, 1); vecB = vec3.fromValues(3, 1, 3); });

        describe("with a separate output vector", function() {
            beforeEach(function() { result = vec3.max(out, vecA, vecB); });

            it("should place values into out", function() { expect(out).toBeEqualish(vec3.fromValues(3, 3, 3)); });
            it("should return out", function() { expect(result).toBe(out); });
            it("should not modify vecA", function() { expect(vecA).toBeEqualish(vec3.fromValues(1, 3, 1)); });
            it("should not modify vecB", function() { expect(vecB).toBeEqualish(vec3.fromValues(3, 1, 3)); });
        });

        describe("when vecA is the output vector", function() {
            beforeEach(function() { result = vec3.max(vecA, vecA, vecB); });

            it("should place values into vecA", function() { expect(vecA).toBeEqualish(vec3.fromValues(3, 3, 3)); });
            it("should return vecA", function() { expect(result).toBe(vecA); });
            it("should not modify vecB", function() { expect(vecB).toBeEqualish(vec3.fromValues(3, 1, 3)); });
        });

        describe("when vecB is the output vector", function() {
            beforeEach(function() { result = vec3.max(vecB, vecA, vecB); });

            it("should place values into vecB", function() { expect(vecB).toBeEqualish(vec3.fromValues(3, 3, 3)); });
            it("should return vecB", function() { expect(result).toBe(vecB); });
            it("should not modify vecA", function() { expect(vecA).toBeEqualish(vec3.fromValues(1, 3, 1)); });
        });
    });

    describe("round", function() {
        beforeEach(function() { vecA = vec3.fromValues(Math.E, Math.PI, Math.SQRT2); });

        describe("with a separate output vector", function() {
            beforeEach(function() { result = vec3.round(out, vecA); });

            it("should place values into out", function() { expect(out).toBeEqualish(vec3.fromValues(3, 3, 1)); });
            it("should return out", function() { expect(result).toBe(out); });
            it("should not modify vecA", function() { expect(vecA).toBeEqualish(vec3.fromValues(Math.E, Math.PI, Math.SQRT2)); });
        });

        describe("when vecA is the output vector", function() {
            beforeEach(function() { result = vec3.round(vecA, vecA); });

            it("should place values into vecA", function() { expect(vecA).toBeEqualish(vec3.fromValues(3, 3, 1)); });
            it("should return vecA", function() { expect(result).toBe(vecA); });
        });
    });

    describe("scale", function() {
        describe("with a separate output vector", function() {
            beforeEach(function() { result = vec3.scale(out, vecA, 2); });

            it("should place values into out", function() { expect(out).toBeEqualish(vec3.fromValues(2, 4, 6)); });
            it("should return out", function() { expect(result).toBe(out); });
            it("should not modify vecA", function() { expect(vecA).toBeEqualish(vec3.fromValues(1, 2, 3)); });
        });

        describe("when vecA is the output vector", function() {
            beforeEach(function() { result = vec3.scale(vecA, vecA, 2); });

            it("should place values into vecA", function() { expect(vecA).toBeEqualish(vec3.fromValues(2, 4, 6)); });
            it("should return vecA", function() { expect(result).toBe(vecA); });
        });
    });

    describe("scaleAndAdd", function() {
        describe("with a separate output vector", function() {
            beforeEach(function() { result = vec3.scaleAndAdd(out, vecA, vecB, 0.5); });

            it("should place values into out", function() { expect(out).toBeEqualish(vec3.fromValues(3, 4.5, 6)); });
            it("should return out", function() { expect(result).toBe(out); });
            it("should not modify vecA", function() { expect(vecA).toBeEqualish(vec3.fromValues(1, 2, 3)); });
            it("should not modify vecB", function() { expect(vecB).toBeEqualish(vec3.fromValues(4, 5, 6)); });
        });

        describe("when vecA is the output vector", function() {
            beforeEach(function() { result = vec3.scaleAndAdd(vecA, vecA, vecB, 0.5); });

            it("should place values into vecA", function() { expect(vecA).toBeEqualish(vec3.fromValues(3, 4.5, 6)); });
            it("should return vecA", function() { expect(result).toBe(vecA); });
            it("should not modify vecB", function() { expect(vecB).toBeEqualish(vec3.fromValues(4, 5, 6)); });
        });

        describe("when vecB is the output vector", function() {
            beforeEach(function() { result = vec3.scaleAndAdd(vecB, vecA, vecB, 0.5); });

            it("should place values into vecB", function() { expect(vecB).toBeEqualish(vec3.fromValues(3, 4.5, 6)); });
            it("should return vecB", function() { expect(result).toBe(vecB); });
            it("should not modify vecA", function() { expect(vecA).toBeEqualish(vec3.fromValues(1, 2, 3)); });
        });
    });

    describe("distance", function() {
        it("should have an alias called 'dist'", function() { expect(vec3.dist).toEqual(vec3.distance); });

        beforeEach(function() { numResult = vec3.distance(vecA, vecB); });

        it("should return the distance", function() { expect(numResult).toBeNearly(5.196152); });
    });

    describe("squaredDistance", function() {
        it("should have an alias called 'sqrDist'", function() { expect(vec3.sqrDist).toEqual(vec3.squaredDistance); });

        beforeEach(function() { numResult = vec3.squaredDistance(vecA, vecB); });

        it("should return the squared distance", function() { expect(numResult).toBeNearly(27); });
    });

    describe("length", function() {
        it("should have an alias called 'len'", function() { expect(vec3.len).toEqual(vec3.length); });

        beforeEach(function() { numResult = vec3.len(vecA); });

        it("should return the length", function() { expect(numResult).toBeNearly(3.741657); });
    });

    describe("squaredLength", function() {
        it("should have an alias called 'sqrLen'", function() { expect(vec3.sqrLen).toEqual(vec3.squaredLength); });

        beforeEach(function() { numResult = vec3.squaredLength(vecA); });

        it("should return the squared length", function() { expect(numResult).toBeNearly(14); });
    });

    describe("negate", function() {
        describe("with a separate output vector", function() {
            beforeEach(function() { result = vec3.negate(out, vecA); });

            it("should place values into out", function() { expect(out).toBeEqualish(vec3.fromValues(-1, -2, -3)); });
            it("should return out", function() { expect(result).toBe(out); });
            it("should not modify vecA", function() { expect(vecA).toBeEqualish(vec3.fromValues(1, 2, 3)); });
        });

        describe("when vecA is the output vector", function() {
            beforeEach(function() { result = vec3.negate(vecA, vecA); });

            it("should place values into vecA", function() { expect(vecA).toBeEqualish(vec3.fromValues(-1, -2, -3)); });
            it("should return vecA", function() { expect(result).toBe(vecA); });
        });
    });

    describe("normalize", function() {
        beforeEach(function() { vecA = vec3.fromValues(5, 0, 0); });

        describe("with a separate output vector", function() {
            beforeEach(function() { result = vec3.normalize(out, vecA); });

            it("should place values into out", function() { expect(out).toBeEqualish(vec3.fromValues(1, 0, 0)); });
            it("should return out", function() { expect(result).toBe(out); });
            it("should not modify vecA", function() { expect(vecA).toBeEqualish(vec3.fromValues(5, 0, 0)); });
        });

        describe("when vecA is the output vector", function() {
            beforeEach(function() { result = vec3.normalize(vecA, vecA); });

            it("should place values into vecA", function() { expect(vecA).toBeEqualish(vec3.fromValues(1, 0, 0)); });
            it("should return vecA", function() { expect(result).toBe(vecA); });
        });
    });

    describe("dot", function() {
        beforeEach(function() { numResult = vec3.dot(vecA, vecB); });

        it("should return the dot product", function() { expect(numResult).toEqual(32); });
        it("should not modify vecA", function() { expect(vecA).toBeEqualish(vec3.fromValues(1, 2, 3)); });
        it("should not modify vecB", function() { expect(vecB).toBeEqualish(vec3.fromValues(4, 5, 6)); });
    });

    describe("cross", function() {
        describe("with a separate output vector", function() {
            beforeEach(function() { result = vec3.cross(out, vecA, vecB); });

            it("should place values into out", function() { expect(out).toBeEqualish(vec3.fromValues(-3, 6, -3)); });
            it("should return out", function() { expect(result).toBe(out); });
            it("should not modify vecA", function() { expect(vecA).toBeEqualish(vec3.fromValues(1, 2, 3)); });
            it("should not modify vecB", function() { expect(vecB).toBeEqualish(vec3.fromValues(4, 5, 6)); });
        });

        describe("when vecA is the output vector", function() {
            beforeEach(function() { result = vec3.cross(vecA, vecA, vecB); });

            it("should place values into vecA", function() { expect(vecA).toBeEqualish(vec3.fromValues(-3, 6, -3)); });
            it("should return vecA", function() { expect(result).toBe(vecA); });
            it("should not modify vecB", function() { expect(vecB).toBeEqualish(vec3.fromValues(4, 5, 6)); });
        });

        describe("when vecB is the output vector", function() {
            beforeEach(function() { result = vec3.cross(vecB, vecA, vecB); });

            it("should place values into vecB", function() { expect(vecB).toBeEqualish(vec3.fromValues(-3, 6, -3)); });
            it("should return vecB", function() { expect(result).toBe(vecB); });
            it("should not modify vecA", function() { expect(vecA).toBeEqualish(vec3.fromValues(1, 2, 3)); });
        });
    });

    describe("lerp", function() {
        describe("with a separate output vector", function() {
            beforeEach(function() { result = vec3.lerp(out, vecA, vecB, 0.5); });

            it("should place values into out", function() { expect(out).toBeEqualish(vec3.fromValues(2.5, 3.5, 4.5)); });
            it("should return out", function() { expect(result).toBe(out); });
            it("should not modify vecA", function() { expect(vecA).toBeEqualish(vec3.fromValues(1, 2, 3)); });
            it("should not modify vecB", function() { expect(vecB).toBeEqualish(vec3.fromValues(4, 5, 6)); });
        });

        describe("when vecA is the output vector", function() {
            beforeEach(function() { result = vec3.lerp(vecA, vecA, vecB, 0.5); });

            it("should place values into vecA", function() { expect(vecA).toBeEqualish(vec3.fromValues(2.5, 3.5, 4.5)); });
            it("should return vecA", function() { expect(result).toBe(vecA); });
            it("should not modify vecB", function() { expect(vecB).toBeEqualish(vec3.fromValues(4, 5, 6)); });
        });

        describe("when vecB is the output vector", function() {
            beforeEach(function() { result = vec3.lerp(vecB, vecA, vecB, 0.5); });

            it("should place values into vecB", function() { expect(vecB).toBeEqualish(vec3.fromValues(2.5, 3.5, 4.5)); });
            it("should return vecB", function() { expect(result).toBe(vecB); });
            it("should not modify vecA", function() { expect(vecA).toBeEqualish(vec3.fromValues(1, 2, 3)); });
        });
    });

    describe("random", function() {
        describe("with no scale", function() {
            beforeEach(function() { result = vec3.random(out); });

            it("should result in a unit length vector", function() { expect(vec3.len(out)).toBeNearly(1.0); });
            it("should return out", function() { expect(result).toBe(out); });
        });

        describe("with a scale", function() {
            beforeEach(function() { result = vec3.random(out, 5.0); });

            it("should result in a unit length vector", function() { expect(vec3.len(out)).toBeNearly(5.0); });
            it("should return out", function() { expect(result).toBe(out); });
        });
    });

    describe("angle", function() {
        beforeEach(function() { numResult = vec3.angle(vecA, vecB); });

        it("should return the angle", function() { expect(numResult).toBeNearly(0.225726); });
        it("should not modify vecA", function() { expect(vecA).toBeEqualish(vec3.fromValues(1, 2, 3)); });
        it("should not modify vecB", function() { expect(vecB).toBeEqualish(vec3.fromValues(4, 5, 6)); });
    });

    describe("str", function() {
        beforeEach(function() { strResult = vec3.str(vecA); });

        it("should return a string representation of the vector", function() { expect(strResult).toEqual("vec3(1, 2, 3)"); });
    });

    describe("exactEquals", function() {
        let vecC: Vec3;
        let r0: boolean;
        let r1: boolean;

        beforeEach(function() {
            vecA = vec3.fromValues(0, 1, 2);
            vecB = vec3.fromValues(0, 1, 2);
            vecC = vec3.fromValues(1, 2, 3);
            r0 = vec3.exactEquals(vecA, vecB);
            r1 = vec3.exactEquals(vecA, vecC);
        });

        it("should return true for identical vectors", function() { expect(r0).toBe(true); });
        it("should return false for different vectors", function() { expect(r1).toBe(false); });
        it("should not modify vecA", function() { expect(vecA).toBeEqualish(vec3.fromValues(0, 1, 2)); });
        it("should not modify vecB", function() { expect(vecB).toBeEqualish(vec3.fromValues(0, 1, 2)); });
    });

    describe("equals", function() {
        let vecC: Vec3;
        let vecD: Vec3;
        let r0: boolean;
        let r1: boolean;
        let r2: boolean;

        beforeEach(function() {
            vecA = vec3.fromValues(0, 1, 2);
            vecB = vec3.fromValues(0, 1, 2);
            vecC = vec3.fromValues(1, 2, 3);
            vecD = vec3.fromValues(1e-16, 1, 2);
            r0 = vec3.equals(vecA, vecB);
            r1 = vec3.equals(vecA, vecC);
            r2 = vec3.equals(vecA, vecD);
        });
        it("should return true for identical vectors", function() { expect(r0).toBe(true); });
        it("should return false for different vectors", function() { expect(r1).toBe(false); });
        it("should return true for close but not identical vectors", function() { expect(r2).toBe(true); });
        it("should not modify vecA", function() { expect(vecA).toBeEqualish(vec3.fromValues(0, 1, 2)); });
        it("should not modify vecB", function() { expect(vecB).toBeEqualish(vec3.fromValues(0, 1, 2)); });
    });

    describe("zero", function() {
        beforeEach(function() {
            vecA = vec3.fromValues(1, 2, 3);
            result = vec3.zero(vecA);
        });
        it("should result in a 3 element vector with zeros", function() { expect(result).toBeEqualish(vec3.fromValues(0, 0, 0)); });
    });
});
