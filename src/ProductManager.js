import { log } from "console";
import fs from "fs";

class ProductManager {
  constructor(path) {
    this.path = path;
    this.format = "utf-8";
  }

  getNewID = (list) => {
    const count = list.length;
    return count > 0 ? list[count - 1].id + 1 : 1;
  };

  add = async (title, description, price, thumbnail, code, stock) => {
    const list = await this.get();
    const newID = this.getNewID(list);
    const exis = list.some((el) => el.code == code);
    if (!exis) {
      const newProduct = {
        id: newID,
        title: title ?? "",
        description: description ?? "",
        price: price ?? 0.0,
        thumbnail: thumbnail ?? [],
        code: code ?? "",
        stock: stock ?? 0,
      };
      list.push(newProduct);
      await this.write(list);
      return newProduct;
    }
    return { error: `code: ${code} already exists` };
  };

  read = () => {
    if (fs.existsSync(this.path)) {
      return fs.promises
        .readFile(this.path, this.format)
        .then((r) => JSON.parse(r));
    }
    return [];
  };

  write = async (list) => {
    fs.promises.writeFile(this.path, JSON.stringify(list));
  };

  get = async () => {
    const list = await this.read();
    return list;
  };

  getbyId = async (id) => {
    const list = await this.get();
    return list.find((prod) => prod.id == id);
  };

  update = async (id,title,description,price,thumbnail,code,stock) => {
		const list = await this.get();
		const productUpdate = this.getbyId(id);
		productUpdate = {
			id: id,
			title: title,
			description: description,
			price: price,
			thumbnail:thumbnail,
			code:code,
			stock:stock
		}
		list.push(productUpdate)
		await this.write()
		return productUpdate

  };

  delete = async (id) => {
    const list = await this.get();
    const idx = list.findIndex((e) => e.id == id);
    if (idx < 0) return;
    list.splice(idx, 1);
    await this.write(list);
    return list;
  };
}

const manager = new ProductManager("src/json/productos.json");
console.log(await manager.read());
console.log(await manager.get());
console.log(await manager.add("Producto prueba","Producto descripcion", 200,"No tiene","abc123",25));
console.log(await manager.add("Producto prueba","Producto descripcion", 200,"No tiene","abc125",25));

console.log("Producto por id:",await manager.getbyId(1));
//console.log("Producto borrado por id",await manager.delete(2));
/* console.log(
  "Producto actualizado:",
  await manager.update(2, {
    id: 2,
    title: "Producto prueba actualizado",
    description: "Producto descripcion",
    price: 200,
    thumbnail: "No tiene",
    code: "abc33",
    stock: 30,
  })
); */

