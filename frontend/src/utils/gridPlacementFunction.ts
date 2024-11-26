export type DynamicGridSizes = "SQUARE" | "PORTRAIT" | "LANDSCAPE";

const gridPlacementFunction = <
  T extends {
    size: DynamicGridSizes;
  },
>(
  elements: T[],
  matrixHeight: number,
  matrixWidth: number
) => {
  const matrix: string[][] = new Array(matrixHeight)
    .fill("0")
    .map(() => new Array(matrixWidth).fill("0"));

  //   console.log("m", matrix);
  const newElements: T[] = JSON.parse(JSON.stringify(elements));
  for (const elem of newElements) {
    const space = [0, 0];
    switch (elem.size) {
      case "SQUARE":
        for (let i = 0; i < matrix.length; i++) {
          space[1] = matrix[i].findIndex((_, j) => {
            // console.log(elem, "j is ", j, matrix[i][j]);
            return matrix[i][j] == "0";
          });
          if (space[1] != -1) {
            space[0] = i;
            break;
          }
        }
        if (space[1] == -1) {
          matrix.push(new Array(matrixWidth).fill("0"));
          space[0] = matrix.length - 1;
          space[1] = 0;
        }
        matrix[space[0]][space[1]] = "s";
        break;
      case "PORTRAIT":
        for (let i = 0; i < matrix.length; i++) {
          space[1] = matrix[i].findIndex((_, j) => {
            if (!matrix[i + 1]) {
              matrix.push(new Array(matrixWidth).fill("0"));
            }
            return matrix[i][j] === "0" && matrix[i + 1][j] === "0";
          });
          if (space[1] != -1) {
            space[0] = i;
            break;
          }
        }

        matrix[space[0]][space[1]] = "p";
        matrix[space[0] + 1][space[1]] = "p";

        // console.log("adding");

        break;
      case "LANDSCAPE":
        for (let i = 0; i < matrix.length; i++) {
          space[1] = matrix[i].findIndex((_, j) => {
            if (j < 2) {
              return matrix[i][j] === "0" && matrix[i][j + 1] === "0";
            } else return false;
          });
          if (space[1] != -1) {
            space[0] = i;
            break;
          }
        }

        if (space[1] == -1) {
          matrix.push(new Array(matrixWidth).fill("0"));
          space[0] = matrix.length - 1;
          space[1] = 0;
        }
        matrix[space[0]][space[1]] = "l";
        matrix[space[0]][space[1] + 1] = "l";
        break;
    }
  }

  return {
    matrix,
    elements: newElements,
  };
};

export default gridPlacementFunction;
