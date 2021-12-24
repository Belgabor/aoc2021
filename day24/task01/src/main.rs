use std::thread;
use std::time::Instant;


fn evaluate(i0: i128, i1: i128, i2: i128, i3: i128, i4: i128, i5: i128, i6: i128, i7: i128, i8: i128, i9: i128, i10: i128, i11: i128, i12: i128, i13: i128) -> i128 {
    let v0:i128 = (i0 + (8));
    let v1:i128 = (v0 % (26));
    let v2:i128 = (v1 + (13));
    let v3:i128 = (if (v2 == i1) {1} else {0});
    let v4:i128 = (if (v3 == 0) {1} else {0});
    let v5:i128 = (25 * v4);
    let v6:i128 = (v5 + (1));
    let v7:i128 = (v0 * v6);
    let v8:i128 = (i1 + (8));
    let v9:i128 = (v8 * v4);
    let v10:i128 = (v7 + v9);
    let v11:i128 = (v10 % (26));
    let v12:i128 = (v11 + (13));
    let v13:i128 = (if (v12 == i2) {1} else {0});
    let v14:i128 = (if (v13 == 0) {1} else {0});
    let v15:i128 = (25 * v14);
    let v16:i128 = (v15 + (1));
    let v17:i128 = (v10 * v16);
    let v18:i128 = (i2 + (3));
    let v19:i128 = (v18 * v14);
    let v20:i128 = (v17 + v19);
    let v21:i128 = (v20 % (26));
    let v22:i128 = (v21 + (12));
    let v23:i128 = (if (v22 == i3) {1} else {0});
    let v24:i128 = (if (v23 == 0) {1} else {0});
    let v25:i128 = (25 * v24);
    let v26:i128 = (v25 + (1));
    let v27:i128 = (v20 * v26);
    let v28:i128 = (i3 + (10));
    let v29:i128 = (v28 * v24);
    let v30:i128 = (v27 + v29);
    let v31:i128 = (v30 % (26));
    let v32:i128 = (v30 / (26));
    let v33:i128 = (v31 + (-12));
    let v34:i128 = (if (v33 == i4) {1} else {0});
    let v35:i128 = (if (v34 == 0) {1} else {0});
    let v36:i128 = (25 * v35);
    let v37:i128 = (v36 + (1));
    let v38:i128 = (v32 * v37);
    let v39:i128 = (i4 + (8));
    let v40:i128 = (v39 * v35);
    let v41:i128 = (v38 + v40);
    let v42:i128 = (v41 % (26));
    let v43:i128 = (v42 + (12));
    let v44:i128 = (if (v43 == i5) {1} else {0});
    let v45:i128 = (if (v44 == 0) {1} else {0});
    let v46:i128 = (25 * v45);
    let v47:i128 = (v46 + (1));
    let v48:i128 = (v41 * v47);
    let v49:i128 = (i5 + (8));
    let v50:i128 = (v49 * v45);
    let v51:i128 = (v48 + v50);
    let v52:i128 = (v51 % (26));
    let v53:i128 = (v51 / (26));
    let v54:i128 = (v52 + (-2));
    let v55:i128 = (if (v54 == i6) {1} else {0});
    let v56:i128 = (if (v55 == 0) {1} else {0});
    let v57:i128 = (25 * v56);
    let v58:i128 = (v57 + (1));
    let v59:i128 = (v53 * v58);
    let v60:i128 = (i6 + (8));
    let v61:i128 = (v60 * v56);
    let v62:i128 = (v59 + v61);
    let v63:i128 = (v62 % (26));
    let v64:i128 = (v62 / (26));
    let v65:i128 = (v63 + (-11));
    let v66:i128 = (if (v65 == i7) {1} else {0});
    let v67:i128 = (if (v66 == 0) {1} else {0});
    let v68:i128 = (25 * v67);
    let v69:i128 = (v68 + (1));
    let v70:i128 = (v64 * v69);
    let v71:i128 = (i7 + (5));
    let v72:i128 = (v71 * v67);
    let v73:i128 = (v70 + v72);
    let v74:i128 = (v73 % (26));
    let v75:i128 = (v74 + (13));
    let v76:i128 = (if (v75 == i8) {1} else {0});
    let v77:i128 = (if (v76 == 0) {1} else {0});
    let v78:i128 = (25 * v77);
    let v79:i128 = (v78 + (1));
    let v80:i128 = (v73 * v79);
    let v81:i128 = (i8 + (9));
    let v82:i128 = (v81 * v77);
    let v83:i128 = (v80 + v82);
    let v84:i128 = (v83 % (26));
    let v85:i128 = (v84 + (14));
    let v86:i128 = (if (v85 == i9) {1} else {0});
    let v87:i128 = (if (v86 == 0) {1} else {0});
    let v88:i128 = (25 * v87);
    let v89:i128 = (v88 + (1));
    let v90:i128 = (v83 * v89);
    let v91:i128 = (i9 + (3));
    let v92:i128 = (v91 * v87);
    let v93:i128 = (v90 + v92);
    let v94:i128 = (v93 % (26));
    let v95:i128 = (v93 / (26));
    let v96:i128 = (if (v94 == i10) {1} else {0});
    let v97:i128 = (if (v96 == 0) {1} else {0});
    let v98:i128 = (25 * v97);
    let v99:i128 = (v98 + (1));
    let v100:i128 = (v95 * v99);
    let v101:i128 = (i10 + (4));
    let v102:i128 = (v101 * v97);
    let v103:i128 = (v100 + v102);
    let v104:i128 = (v103 % (26));
    let v105:i128 = (v103 / (26));
    let v106:i128 = (v104 + (-12));
    let v107:i128 = (if (v106 == i11) {1} else {0});
    let v108:i128 = (if (v107 == 0) {1} else {0});
    let v109:i128 = (25 * v108);
    let v110:i128 = (v109 + (1));
    let v111:i128 = (v105 * v110);
    let v112:i128 = (i11 + (9));
    let v113:i128 = (v112 * v108);
    let v114:i128 = (v111 + v113);
    let v115:i128 = (v114 % (26));
    let v116:i128 = (v114 / (26));
    let v117:i128 = (v115 + (-13));
    let v118:i128 = (if (v117 == i12) {1} else {0});
    let v119:i128 = (if (v118 == 0) {1} else {0});
    let v120:i128 = (25 * v119);
    let v121:i128 = (v120 + (1));
    let v122:i128 = (v116 * v121);
    let v123:i128 = (i12 + (2));
    let v124:i128 = (v123 * v119);
    let v125:i128 = (v122 + v124);
    let v126:i128 = (v125 % (26));
    let v127:i128 = (v125 / (26));
    let v128:i128 = (v126 + (-6));
    let v129:i128 = (if (v128 == i13) {1} else {0});
    let v130:i128 = (if (v129 == 0) {1} else {0});
    let v131:i128 = (25 * v130);
    let v132:i128 = (v131 + (1));
    let v133:i128 = (v127 * v132);
    let v134:i128 = (i13 + (7));
    let v135:i128 = (v134 * v130);
    let v136:i128 = (v133 + v135);

    return v136;
}

fn run(i0: i128, i1: i128) {
    let start = Instant::now();
    let mut iteration: u128 = 0;
    let space: u128 = (9u128).pow(12);
    // for i1 in (1..10).rev() {
    for i2 in (1..10).rev() {
        for i3 in (1..10).rev() {
            for i4 in (1..10).rev() {
                for i5 in (1..10).rev() {
                    for i6 in (1..10).rev() {
                        for i7 in (1..10).rev() {
                            for i8 in (1..10).rev() {
                                for i9 in (1..10).rev() {
                                    let mut i10: i128 = 9;
                                    while i10 > 0 {
                                        //for i10 in (1..9).rev() {
                                        let mut i11: i128 = 9;
                                        while i11 > 0 {
                                            //for i11 in (1..9).rev() {
                                            let mut i12: i128 = 9;
                                            while i12 > 0 {
                                                //for i12 in (1..9).rev() {
                                                let mut i13: i128 = 9;
                                                while i13 > 0 {
                                                    //for i13 in (1..9).rev() {
                                                    iteration += 1;

                                                    let z = evaluate(i0, i1, i2, i3, i4, i5, i6, i7, i8, i9, i10, i11, i12, i13);

                                                    if z == 0 {
                                                        println!(
                                                            "{}{}{}{}{}{}{}{}{}{}{}{}{}{}",
                                                            i0,
                                                            i1,
                                                            i2,
                                                            i3,
                                                            i4,
                                                            i5,
                                                            i6,
                                                            i7,
                                                            i8,
                                                            i9,
                                                            i10,
                                                            i11,
                                                            i12,
                                                            i13
                                                        );
                                                        return;
                                                    }

                                                    i13 -= 1;
                                                }
                                                i12 -= 1;
                                            }
                                            i11 -= 1;
                                        }
                                        i10 -= 1;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            // println!("{} {}", iteration, space);

            let left = space - iteration;
            let left_time = start.elapsed().as_millis() * left / iteration;
            println!(
                "[{}{}] {} {} {}",
                i0,
                i1,
                left_time / 60000,
                start.elapsed().as_nanos() / iteration,
                1000 * iteration / space
            );
        }
    }
    // }
}
fn main() {
    println!("Hello, world!");

    let mut handles = Vec::<thread::JoinHandle<()>>::with_capacity(9 * 9);

    for i0 in (1..8).rev() {
        for i1 in (1..10).rev() {
            handles.push(thread::spawn(move || {
                run(i0, i1);
            }));
        }
    }

    for handle in handles {
        handle.join().unwrap();
    }
}
